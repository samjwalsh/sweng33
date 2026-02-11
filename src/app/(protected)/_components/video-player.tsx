import type { Video } from "@/lib/video-type";

export default function VideoPlayer({ video }: { video: Video }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%", // 16:9 Aspect Ratio
        backgroundColor: "gray",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
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
          fontSize: "24px",
        }}
      >
        Video Placeholder
      </div>
      <div>
        {video.sourceBlob}
        {video.completedBlob}
      </div>
    </div>
  );
}
