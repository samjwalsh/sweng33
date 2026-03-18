"use client";

import type { Video } from "@/lib/video-type";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VideoPlayer from "./video-player";
import { DownloadVideo } from "@/app/_components/download-video";
import { Progress } from "@/components/ui/progress";
import { Field, FieldLabel } from "@/components/ui/field";
import { api } from "@/trpc/react"


/*

Main thing is that there is a prominent download button for the video, but you would probably expect to be able to see all of the info about it like when you uploaded it and maybe a player for the video
The source language and the destination language.
We should probably also have a button to delete the video if the user is done with it.

*/


export default function VideoViewer({
  video,
  onDeleteVideo,
  isDeleting = false,
}: {
  video: Video;
  onDeleteVideo: (videoId: string) => Promise<void>;
  isDeleting?: boolean;
}) {
  const handleDeleteVideo = async () => {
    const confirmed = window.confirm("Delete this video?");
    if (!confirmed) return;
    await onDeleteVideo(video.id);
  };

  //FIGURE OUT TESTING!!!
  const exampleVideo = {
    id: "video_123",
    title: "My First Video",
    createdById: "user_abc",
    createdAt: new Date(), // or an ISO string
    sourceBlob: "s3://bucket/source.mp4",
    completedBlob: null, // or "s3://bucket/completed.mp4"
    status: "processing", // one of: "queued", "processing", "done", "failed"
    sourceLanguage: "en", // match your languageValues (e.g. "en", "es")
    destLanguage: "es",
    
    diarizationCompletedTasks: 0,
    diarizationTotalTasks: 3,
    translationCompletedTasks: 0,
    translationTotalTasks: 5,
    ttsCompletedTasks: 0,
    ttsTotalTasks: 5,
    reconstructionCompletedTasks: 0,
    reconstructionTotalTasks: 1,
    
  };


  const {data: progress} = api.video.getVideoProgress.useQuery({videoId: exampleVideo.id}, //calling backend endpoint   CHANGE BACK TO VIDEO
    {
      refetchInterval: 2000   //refetches the data every 2 seconds
    }
  )

  const liveVideo = progress ?? video; 

  //returns the current task that the video is on
  const currentTask = () => {
    if (
      liveVideo.diarizationTotalTasks != null &&
      liveVideo.diarizationCompletedTasks != null &&
      liveVideo.diarizationCompletedTasks < liveVideo.diarizationTotalTasks
    ) {
      return "Diarisation"
    } else if (
      liveVideo.translationTotalTasks != null &&
      liveVideo.translationCompletedTasks != null &&
      liveVideo.translationCompletedTasks < liveVideo.translationTotalTasks
    ) {
      return "Translation"
    } else if (
      liveVideo.ttsTotalTasks != null &&
      liveVideo.ttsCompletedTasks != null &&
      liveVideo.ttsCompletedTasks < liveVideo.ttsTotalTasks
    ) {
      return "Text-To-Speech"
    } else if (
      liveVideo.reconstructionTotalTasks != null &&
      liveVideo.reconstructionCompletedTasks != null &&
      liveVideo.reconstructionCompletedTasks < liveVideo.reconstructionTotalTasks
    ) {
      return "Reconstruction"
    } else {
      if(taskCompletionPercent() === 0){
        return "Not Started"
      }
      return "Completed"
    }

  };

  //returns the percentage of tasks completed
  const taskCompletionPercent = (): number => {
    const totalTasks =
      (liveVideo.diarizationTotalTasks ?? 0) +
      (liveVideo.translationTotalTasks ?? 0) +
      (liveVideo.ttsTotalTasks ?? 0) +
      (liveVideo.reconstructionTotalTasks ?? 0);

    const completedTasks =
      (liveVideo.diarizationCompletedTasks ?? 0) +
      (liveVideo.translationCompletedTasks ?? 0) +
      (liveVideo.ttsCompletedTasks ?? 0) +
      (liveVideo.reconstructionCompletedTasks ?? 0);

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };


  return (
    <div style ={{ padding: "40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Gray Box Placeholder for Video */}
        <VideoPlayer video={video} />
        {/* Bottom section under the video*/}
        <div
          style={{
            paddingTop: "0px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "24px",
          }}
        >
          {/* Left: title + other details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "45px", fontWeight: "bold", marginTop: "10px"}}>
                {exampleVideo.title /*CHANGE BACK TO VIDEO */} 
              </h1>

              {/* Small square action button to edit title and other actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-8 w-8 items-center justify-center p-0"
                    style={{ fontSize: "20px" }}
                  >
                    ☰
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit Video Title</DropdownMenuItem>
                  <DropdownMenuItem>
                    Change Destination Language
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={(event) => {
                      event.preventDefault();
                      void handleDeleteVideo();
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete Video"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Video Details */}
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              <p>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</p>
              <p>Source Language: {video.sourceLanguage.toUpperCase()}</p>
              <p>
                Destination Language: {video.destLanguage.toLocaleUpperCase()}
              </p>
            </div>
          </div>

          {/* Right: translation status + export (bottom-right under video) */}
          <div
            style={{
              width: "340px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              color: "#333",
              position: "relative",
              top: "-30px",
              
            }}
          >
            <h3
              style={{
                fontSize: "25px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Translation Status:
            </h3>

            <div className="flex flex-wrap justify-between">
              <Badge variant={liveVideo.status == "queued" ? "outline" : "ghost"}>
                Queued
              </Badge>

              <Badge
                variant={liveVideo.status == "processing" ? "outline" : "ghost"}
                className={
                  liveVideo.status === "processing"
                    ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                    : ""
                }
              >
                Processing
                {liveVideo.status === "processing" && (
                  <Spinner
                    className="ml-2 inline-block align-middle"
                    data-icon="inline-end"
                  />
                )}
              </Badge>

              <Badge
                variant={liveVideo.status == "done" ? "outline" : "ghost"}
                className={
                  liveVideo.status == "done"
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : ""
                }
              >
                Ready
              </Badge>

              <Badge
                variant={liveVideo.status == "failed" ? "outline" : "ghost"}
                className={
                  liveVideo.status === "failed"
                    ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : ""
                }
              >
                Failed
              </Badge>
            </div>

            {/* Progress on translation for the user */}
            <div style={{ marginTop: "30px"}}>
              <Field className="w-full max-w-sm">
                <Progress value={taskCompletionPercent()} id="progress-upload" />
                <FieldLabel htmlFor="progress-upload">
                  <span>{currentTask()}</span>
                  <span className="ml-auto">{taskCompletionPercent()}%</span>
                </FieldLabel>
              </Field>
            </div>

            <div style={{ 
              marginTop: "30px" }}>
              <DownloadVideo
                completedBlobId={video.completedBlob}
                originalBlobId={video.sourceBlob}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
