"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { sampleVideos, type Video } from "@/lib/video-type";
import { LanguageCode } from "@/lib/languages";
import type { Session } from "@/server/better-auth/client";

import { AppSidebar } from "./app-sidebar";
import VideoViewer from "./video-viewer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedPageClient({ session }: { session: Session }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadVideos = async () => {
      // Placeholder API call
      const response = await Promise.resolve<{ data: Video[] }>({
        data: sampleVideos,
      });

      if (isMounted) {
        setVideos(response.data);
        setActiveVideoId(response.data[0]?.id ?? null);
      }
    };
    loadVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateVideo = useCallback(() => {
    const newVideo: Video = {
      id: crypto.randomUUID(),
      title: "Untitled video",
      createdById: session.user.id,
      createdAt: new Date(),
      blob: "pending",
      status: "uploading",
      sourceLanguage: LanguageCode.French,
      destLanguage: LanguageCode.English,
    };

    setVideos((current) => [newVideo, ...current]);
    setActiveVideoId(newVideo.id);
  }, [session.user.id]);

  const activeVideo = useMemo(
    () => videos.find((video) => video.id === activeVideoId) ?? null,
    [videos, activeVideoId],
  );

  return (
    <SidebarProvider>
      <AppSidebar
        videos={videos}
        activeVideo={activeVideo}
        onSelectVideo={setActiveVideoId}
        session={session}
      />
      <SidebarInset>
        <VideoViewer
          activeVideo={activeVideo}
          onCreateVideo={handleCreateVideo}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
