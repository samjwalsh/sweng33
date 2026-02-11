"use client";

import { DownloadButton } from "./download-button";

export function DownloadVideo({
  completedBlobId,
  originalBlobId,
}: {
  completedBlobId: string;
  originalBlobId?: string;
}) {
  return (
    <div className="flex gap-2">
      <DownloadButton
        blobId={completedBlobId}
        filename="autodub-completed.mp4"
        label="Download Translated Video"
      />
      {originalBlobId ? (
        <DownloadButton
          blobId={originalBlobId}
          filename="autodub-original.mp4"
          label="Download original"
        />
      ) : null}
    </div>
  );
}
