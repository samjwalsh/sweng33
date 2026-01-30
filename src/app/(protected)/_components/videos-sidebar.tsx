import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Video } from "@/lib/video-type";
export default function VideosSidebar({
  videos,
  activeVideo,
  onSelectVideo,
}: {
  videos: Video[];
  activeVideo: Video | null;
  onSelectVideo: (id: string | null) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/*For the "Create New Video Button*/}
      <div className="bg-background shrink-0">
        <Button
          variant="ghost"
          className="hover:bg-accent h-14 w-full rounded-none px-2"
        >
          Create New Video 🎬
        </Button>
        <Separator className="my-0" />
      </div>

      {/*Past Videos, the only scrollable area*/}
      <div className="flex-1 overflow-y-auto overscroll-contain py-2">
        <div className="flex w-full flex-col gap-2">
          {videos.map((video, i) => (
            <Card
              key={i}
              className={`group hover:bg-accent mx-2 overflow-hidden p-2 transition-all duration-200 ${
                activeVideo?.id === video.id
                  ? "bg-accent ring-primary/30 ring-2"
                  : ""
              }`}
              onClick={() => onSelectVideo(video.id)}
            >
              <div className="relative h-16 w-full overflow-hidden rounded-sm sm:h-20">
                <img
                  src="https://knetic.org.uk/wp-content/uploads/2020/07/Video-Placeholder.png"
                  alt="Event cover"
                  className="block h-16 w-full object-cover brightness-60 grayscale sm:h-20 dark:brightness-40"
                />
              </div>

              <CardHeader className="space-y-0 px-2 pt-1 pb-2">
                <CardTitle className="truncate text-sm leading-tight">
                  {video.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Created: {new Date(video.createdAt).toLocaleDateString()}
                </CardDescription>
                <CardDescription className="text-xs">
                  {video.sourceLanguage.toUpperCase()} {"-> "}
                  {video.destLanguage.toUpperCase()}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
