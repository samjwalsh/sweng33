import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  if (session) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div>hi</div>
    </HydrateClient>
  );
}
