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
        <Button variant="ghost" className="w-full h-14 px-2 hover:bg-accent rounded-none">Create New Video  🎬</Button>
        <Separator className="my-0" />
      </div>

      {/*Past Videos, the only scrollable area*/}
      <div className="flex-1 overflow-y-auto overscroll-contain pb-2">
        <div className="flex w-full flex-col gap-2">
          {videos.map((video, i) => (
            <Card key={i} className="group mx-2 p-2 overflow-hidden transition-all duration-200 transition-colors hover:bg-accent">
              <div className="relative h-16 sm:h-20 w-full overflow-hidden">
                <img
                  src="https://knetic.org.uk/wp-content/uploads/2020/07/Video-Placeholder.png"
                  alt="Event cover"
                  className="block w-full h-16 sm:h-20 object-cover brightness-60 grayscale dark:brightness-40"
                />
              </div>
          
              <CardHeader className="px-2 pt-1 pb-2 space-y-0">
                <CardTitle className="text-sm leading-tight truncate">{video.title}</CardTitle>
                <CardDescription className="text-xs">
                  Created: {new Date(video.createdAt).toLocaleDateString()}
                </CardDescription>
                <CardDescription className="text-xs">
                  {video.sourceLanguage.toUpperCase()} {'->'} {video.destLanguage.toUpperCase()}
                </CardDescription>
            </CardHeader>
          </Card>          
          ))}
        </div>
      </div>
    </div>
  )
}
