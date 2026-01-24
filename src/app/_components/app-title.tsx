import { Video } from "lucide-react";

export default function AppTitle() {
  return (
    <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row gap-2 p-2">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <Video className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">AutoDub</span>
        <span className="truncate text-xs">Video translating service</span>
      </div>
    </div>
  );
}
