"use client";

import { useEffect, useRef } from "react";
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
import { api } from "@/trpc/react";

export default function VideoViewer({
  video,
  onDeleteVideo,
  isDeleting = false,
}: {
  video: Video;
  onDeleteVideo: (videoId: string) => Promise<void>;
  isDeleting?: boolean;
}) {
  const utils = api.useUtils();
  const hasRequestedRefreshRef = useRef(false);

  const handleDeleteVideo = async () => {
    const confirmed = window.confirm("Delete this video?");
    if (!confirmed) return;
    await onDeleteVideo(video.id);
  };

  const { data: progress } = api.video.getVideoProgress.useQuery(
    { videoId: video.id },
    {
      refetchInterval: 2000,
    },
  );

  const liveVideo = progress ?? video;

  useEffect(() => {
    hasRequestedRefreshRef.current = false;
  }, [video.id]);

  useEffect(() => {
    if (progress?.status !== "done" || hasRequestedRefreshRef.current) return;

    hasRequestedRefreshRef.current = true;
    void utils.video.getMyVideos.invalidate();
  }, [progress?.status, utils.video.getMyVideos]);

  // Returns the current task while work is in progress.
  const currentTask = () => {
    if (liveVideo.status === "done") {
      return null;
    }

    if (
      liveVideo.diarizationTotalTasks != null &&
      liveVideo.diarizationCompletedTasks != null &&
      liveVideo.diarizationCompletedTasks < liveVideo.diarizationTotalTasks
    ) {
      return "Diarisation";
    } else if (
      liveVideo.translationTotalTasks != null &&
      liveVideo.translationCompletedTasks != null &&
      liveVideo.translationCompletedTasks < liveVideo.translationTotalTasks
    ) {
      return "Translation";
    } else if (
      liveVideo.ttsTotalTasks != null &&
      liveVideo.ttsCompletedTasks != null &&
      liveVideo.ttsCompletedTasks < liveVideo.ttsTotalTasks
    ) {
      return "Text-To-Speech";
    } else if (
      liveVideo.reconstructionTotalTasks != null &&
      liveVideo.reconstructionCompletedTasks != null &&
      liveVideo.reconstructionCompletedTasks <
        liveVideo.reconstructionTotalTasks
    ) {
      return "Reconstruction";
    } else {
      return "Not Started";
    }
  };

  //returns the percentage of tasks completed
  const getTaskCounts = () => {
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

    const safeTotalTasks = Math.max(0, totalTasks);
    const safeCompletedTasks = Math.min(
      Math.max(0, completedTasks),
      safeTotalTasks,
    );

    return { completedTasks: safeCompletedTasks, totalTasks: safeTotalTasks };
  };

  const taskCompletionPercent = (): number => {
    const { completedTasks, totalTasks } = getTaskCounts();

    if (liveVideo.status === "done") return 100;
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const taskCounts = getTaskCounts();
  const taskLabel = currentTask();

  return (
    <div style={{ padding: "40px" }}>
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
              <h1
                style={{
                  fontSize: "45px",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
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
              <Badge
                variant={liveVideo.status == "queued" ? "outline" : "ghost"}
              >
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
            <div style={{ marginTop: "30px" }}>
              <Field className="w-full max-w-sm">
                <Progress
                  value={taskCompletionPercent()}
                  id="progress-upload"
                />
                <FieldLabel htmlFor="progress-upload">
                  {taskLabel && <span>{taskLabel}</span>}
                  {liveVideo.status !== "done" && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      {taskCounts.completedTasks}/{taskCounts.totalTasks}
                    </span>
                  )}
                  <span className="ml-auto">{taskCompletionPercent()}%</span>
                </FieldLabel>
              </Field>
            </div>

            <div
              style={{
                marginTop: "30px",
              }}
            >
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
