"use client";

import type { Video } from "@/lib/video-type";

export default function VideoViewer({
  activeVideo,
  onCreateVideo,
}: {
  activeVideo: Video | null;
  onCreateVideo: () => void;
}) {
  return <div>video viewer</div>;
}
