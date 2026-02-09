import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
	BlobSASPermissions,
	BlobServiceClient,
	StorageSharedKeyCredential,
	generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { randomUUID } from "crypto";
import path from "path";
import { languageValues } from "@/lib/languages";
import { videos } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

const storageCredential = new StorageSharedKeyCredential(
	env.AZURE_STORAGE_ACCOUNT,
	env.AZURE_STORAGE_KEY,
);
const blobServiceClient = new BlobServiceClient(
	`https://${env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
	storageCredential,
);
const containerClient = blobServiceClient.getContainerClient(
	env.AZURE_STORAGE_CONTAINER,
);

export const videoRouter = createTRPCRouter({
	getMyVideos: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db
			.select()
			.from(videos)
			.where(eq(videos.createdById, ctx.session.user.id))
			.orderBy(desc(videos.createdAt));
	}),
	createUpload: protectedProcedure
		.input(
			z.object({
				fileName: z.string().min(1),
				contentType: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await containerClient.createIfNotExists();

			const extension = path.extname(input.fileName);
			const blobName = `${ctx.session.user.id}/${randomUUID()}${extension}`;
			const blobClient = containerClient.getBlobClient(blobName);

			const startsOn = new Date(Date.now() - 5 * 60 * 1000);
			const expiresOn = new Date(Date.now() + 15 * 60 * 1000);
			const sasToken = generateBlobSASQueryParameters(
				{
					containerName: env.AZURE_STORAGE_CONTAINER,
					blobName,
					permissions: BlobSASPermissions.parse("cw"),
					startsOn,
					expiresOn,
				},
				storageCredential,
			).toString();

			return {
				uploadUrl: `${blobClient.url}?${sasToken}`,
				blobName,
				blobUrl: blobClient.url,
				expiresAt: expiresOn.toISOString(),
			};
		}),

	finalizeUpload: protectedProcedure
		.input(
			z.object({
				blobName: z.string().min(1),
				title: z.string().min(1),
				sourceLanguage: z.enum(languageValues),
				destLanguage: z.enum(languageValues),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.sourceLanguage === input.destLanguage) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Source and destination languages must be different.",
				});
			}

			const blobClient = containerClient.getBlobClient(input.blobName);

			try {
				const properties = await blobClient.getProperties();
				if (!properties.contentLength || properties.contentLength <= 0) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Uploaded blob is empty.",
					});
				}
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Upload not found. Please retry your upload.",
				});
			}

			const [video] = await ctx.db
				.insert(videos)
				.values({
					id: randomUUID(),
					title: input.title.trim(),
					createdById: ctx.session.user.id,
					blob: blobClient.url,
					status: "Queued",
					sourceLanguage: input.sourceLanguage,
					destLanguage: input.destLanguage,
				})
				.returning();

			return video;
		}),
});
