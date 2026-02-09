"use client";

import { useEffect, useMemo, useState } from "react";
import { type Video } from "@/lib/video-type";
import type { Session } from "@/server/better-auth/client";
import { api } from "@/trpc/react";

import { AppSidebar } from "./app-sidebar";
import VideoViewer from "./video-viewer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import VideoUpload from "./video-upload";

export default function ProtectedPageClient({ session }: { session: Session }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [pendingVideoId, setPendingVideoId] = useState<string | null>(null);
  const {
    data: myVideos,
    refetch: refetchMyVideos,
    isLoading: isVideosLoading,
  } = api.video.getMyVideos.useQuery();

  useEffect(() => {
    if (!myVideos) return;

    setVideos(myVideos);

    const pendingExists = pendingVideoId
      ? myVideos.some((video) => video.id === pendingVideoId)
      : false;

    setActiveVideoId((prev) => {
      if (pendingVideoId) return pendingVideoId;
      if (!prev) return myVideos[0]?.id ?? null;
      const prevExists = myVideos.some((video) => video.id === prev);
      return prevExists ? prev : (myVideos[0]?.id ?? null);
    });

    if (pendingExists) {
      setPendingVideoId(null);
    }
  }, [myVideos, pendingVideoId]);

  const activeVideo = useMemo(
    () => videos.find((video) => video.id === activeVideoId) ?? null,
    [videos, activeVideoId],
  );

  const handleUploadComplete = async (createdVideo: Video) => {
    setPendingVideoId(createdVideo.id);
    setActiveVideoId(createdVideo.id);
    setVideos((prev) => {
      if (prev.some((video) => video.id === createdVideo.id)) return prev;
      return [createdVideo, ...prev];
    });
    await refetchMyVideos();
  };

  const handleSelectVideo = (id: string | null) => {
    setPendingVideoId(null);
    setActiveVideoId(id);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        videos={videos}
        activeVideo={activeVideo}
        onSelectVideo={handleSelectVideo}
        session={session}
        isLoading={isVideosLoading}
      />
      <SidebarInset>
        {activeVideo && <VideoViewer video={activeVideo} />}
        {!activeVideo && (
          <VideoUpload onUploadComplete={handleUploadComplete} />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
