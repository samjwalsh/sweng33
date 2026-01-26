"use client";

import * as React from "react";
import { Video } from "lucide-react";

import { NavUser } from "@/app/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Session } from "@/server/better-auth/client";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row gap-2 p-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Video className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">AutoDub</span>
            <span className="truncate text-xs">Video translating service</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <div className="min-h-24 w-full border-2">New Video</div>
        <Separator />
        <div className="flex w-full flex-col gap-2 overflow-scroll border-2">
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
          <div className="min-h-24 border-2">Video</div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
