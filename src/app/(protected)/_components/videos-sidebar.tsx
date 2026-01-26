import { Card } from "@/components/ui/card";
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
    <div>
      <div className="bg-background sticky top-0 z-10">
        <Card className="no-scrollbar mx-2 min-h-24 p-2">
          <div>New Video</div>
        </Card>
        <Separator className="my-2" />
      </div>
      <div className="flex w-full flex-col gap-2 overflow-scroll pb-2">
        {videos.map((video) => {
          return (
            <Card className="no-scrollbar mx-2 min-h-24 p-2">
              <div>{video.title}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
