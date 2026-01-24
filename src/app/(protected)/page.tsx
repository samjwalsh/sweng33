import { AppSidebar } from "@/app/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/server/better-auth/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/signin");

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <div>main area</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
