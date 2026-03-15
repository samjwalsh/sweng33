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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";


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

  //returns the current task that the video is on
  const currentTask = () => {
    if (
      video.diarizationTotalTasks != null &&
      video.diarizationCompletedTasks != null &&
      video.diarizationCompletedTasks < video.diarizationTotalTasks
    ) {
      return "Diarisation"
    } else if (
      video.translationTotalTasks != null &&
      video.translationCompletedTasks != null &&
      video.translationCompletedTasks < video.translationTotalTasks
    ) {
      return "Translation"
    } else if (
      video.ttsTotalTasks != null &&
      video.ttsCompletedTasks != null &&
      video.ttsCompletedTasks < video.ttsTotalTasks
    ) {
      return "Text-To-Speech"
    } else if (
      video.reconstructionTotalTasks != null &&
      video.reconstructionCompletedTasks != null &&
      video.reconstructionCompletedTasks < video.reconstructionTotalTasks
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
      (video.diarizationTotalTasks ?? 0) +
      (video.translationTotalTasks ?? 0) +
      (video.ttsTotalTasks ?? 0) +
      (video.reconstructionTotalTasks ?? 0);

    const completedTasks =
      (video.diarizationCompletedTasks ?? 0) +
      (video.translationCompletedTasks ?? 0) +
      (video.ttsCompletedTasks ?? 0) +
      (video.reconstructionCompletedTasks ?? 0);

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };


  return (
    <div style={{ padding: "40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Gray Box Placeholder for Video */}
        <VideoPlayer video={video} />
        {/* Bottom section under the video*/}
        <div
          style={{
            marginTop: "28px",
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
              <h1 style={{ fontSize: "40px", fontWeight: "bold" }}>
                {video.title}
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
              top: "-55px",
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
              <Badge variant={video.status == "queued" ? "outline" : "ghost"}>
                Queued
              </Badge>

              <Badge
                variant={video.status == "processing" ? "outline" : "ghost"}
                className={
                  video.status === "processing"
                    ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                    : ""
                }
              >
                Processing
                {video.status === "processing" && (
                  <Spinner
                    className="ml-2 inline-block align-middle"
                    data-icon="inline-end"
                  />
                )}
              </Badge>

              <Badge
                variant={video.status == "done" ? "outline" : "ghost"}
                className={
                  video.status == "done"
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : ""
                }
              >
                Ready
              </Badge>

              <Badge
                variant={video.status == "failed" ? "outline" : "ghost"}
                className={
                  video.status === "failed"
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
            

            {/*
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 20px",
                marginTop: "16px",
                position: "relative",
                top: "-10px",
              }}
              >
              
              <Field orientation="horizontal">
                <Checkbox 
                  id="diarisation-checkbox" 
                  name="diarisation-checkbox" 
                  checked={
                    video.diarizationTotalTasks != null &&
                    video.diarizationCompletedTasks==video.diarizationTotalTasks
                    }
                  />
                <FieldLabel htmlFor="diarisation-checkbox">
                  Diarisation: {video.diarizationCompletedTasks} / {video.diarizationTotalTasks}
                </FieldLabel>
              </Field>

              
              <Field orientation="horizontal">
                <Checkbox 
                  id="translation-checkbox"
                  name="translation-checkbox" 
                  checked={
                    video.translationTotalTasks != null &&
                    video.translationCompletedTasks === video.translationTotalTasks
                  }
                />
                <FieldLabel htmlFor="translation-checkbox">
                  Translation: {video.translationCompletedTasks} / {video.translationTotalTasks}
                </FieldLabel>
              </Field>

              
              <Field orientation="horizontal">
                <Checkbox 
                  id="tts-checkbox" 
                  name="tts-checkbox" 
                  checked={
                    video.ttsTotalTasks != null &&
                    video.ttsCompletedTasks==video.ttsTotalTasks
                    }
                  />
                <FieldLabel htmlFor="tts-checkbox">
                  Text-To-Speech: {video.ttsCompletedTasks} / {video.ttsTotalTasks}
                </FieldLabel>
              </Field>

              
              <Field orientation="horizontal">
                <Checkbox 
                  id="reconstruction-checkbox" 
                  name="reconstruction-checkbox" 
                  checked={
                    video.reconstructionTotalTasks != null &&
                    video.reconstructionCompletedTasks==video.reconstructionTotalTasks
                    }
                  />
                <FieldLabel htmlFor="reconstruction-checkbox">
                  Reconstruction: {video.reconstructionCompletedTasks} / {video.reconstructionTotalTasks}
                </FieldLabel>
              </Field>
            </div> 
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
