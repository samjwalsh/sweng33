import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const videoRouter = createTRPCRouter({
	hello: protectedProcedure.query(() => "hello"),
});
