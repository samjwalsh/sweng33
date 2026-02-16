"use client";

import * as React from "react";
import type { Video } from "@/lib/video-type";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

export default function VideoPlayer({ video }: { video: Video }) {
  const completedBlobUrl = video.completedBlob;
  const originalBlobUrl = video.sourceBlob;

  const [selected, setSelected] = React.useState<"completed" | "original">(
    completedBlobUrl ? "completed" : "original",
  );
  const [src, setSrc] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [completedAvailable, setCompletedAvailable] = React.useState(!!completedBlobUrl);
  const [error, setError] = React.useState<string | null>(null);

  const completedQ = api.video.getPlaybackUrl.useQuery(
    { blobUrl: completedBlobUrl ?? "" },
    { enabled: false },
  );
  const originalQ = api.video.getPlaybackUrl.useQuery(
    { blobUrl: originalBlobUrl },
    { enabled: false },
  );

  React.useEffect(() => {
    let cancelled = false;

    async function resolveUrl() {
      setLoading(true);
      setError(null);

      const order: Array<"completed" | "original"> =
        selected === "completed" ? ["completed", "original"] : ["original", "completed"];

      for (const kind of order) {
        try {
          if (kind === "completed") {
            if (!completedBlobUrl) {
              setCompletedAvailable(false);
              continue;
            }
            const res = await completedQ.refetch();
            const url = res.data?.url;
            if (cancelled) return;

            if (url) {
              setCompletedAvailable(true);
              setSrc(url);
              setLoading(false);
              return;
            }
            setCompletedAvailable(false);
          } else {
            const res = await originalQ.refetch();
            const url = res.data?.url;
            if (cancelled) return;

            if (url) {
              setSrc(url);
              setLoading(false);
              return;
            }
          }
        } catch {
          if (cancelled) return;
          if (kind === "completed") setCompletedAvailable(false);
        }
      }

      if (cancelled) return;
      setSrc(null);
      setLoading(false);
      setError("No playable video available.");
    }

    void resolveUrl();
    return () => {
      cancelled = true;
    };
  }, [selected, completedBlobUrl, originalBlobUrl, completedQ, originalQ]);

  return (
    <div>
      {/* Keep your 16:9 container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9
          backgroundColor: "black",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Real video element */}
        {src ? (
          <video
            key={src}
            controls
            preload="metadata"
            src={src}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "black",
            }}
            onError={() => {
              // fallback if translated fails
              if (selected === "completed") setSelected("original");
              else setError("Video failed to load.");
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            {loading ? "Loading video…" : error ?? "No video source."}
          </div>
        )}
      </div>

      {/* Version toggle under the player */}
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <Button
          type="button"
          variant={selected === "completed" ? "default" : "secondary"}
          onClick={() => setSelected("completed")}
          disabled={loading || !completedBlobUrl || !completedAvailable}
        >
          Translated
        </Button>
        <Button
          type="button"
          variant={selected === "original" ? "default" : "secondary"}
          onClick={() => setSelected("original")}
          disabled={loading}
        >
          Original
        </Button>
      </div>
    </div>
  );
}
