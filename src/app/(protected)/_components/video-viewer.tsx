"use client";

import type { Video } from "@/lib/video-type";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
/*

Main thing is that there is a prominent download button for the video, but you would probably expect to be able to see all of the info about it like when you uploaded it and maybe a player for the video
The source language and the destination language.
We should probably also have a button to delete the video if the user is done with it.

*/
export default function VideoViewer({ video }: { video: Video }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", padding: "40px" }}>
      {/* Left Side: Video and Details */}
      <div style={{ flex: 3, paddingRight: "20px" }}>
        {/* Gray Box Placeholder for Video */}
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
        </div>

        {/* Video Title */}
        <h1 style={{ marginTop: "30px", fontSize: "40px", fontWeight: "bold"}}>{video.title}</h1>

        {/* Video Details */}
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          <p>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</p>
          <p>Source Language: {video.sourceLanguage.toUpperCase()}</p>
          <p>Destination Language: {video.destLanguage.toLocaleUpperCase()}</p>
          
        </div>
      </div>
      {/* Right Side: Translation Progress, Export, etc... */}  
      <div style={{ flex: 1, paddingLeft: "20px", fontSize: "14px", color: "#333"}}>
        
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "40px", marginBottom: "10px" }}>
          Translation Status:
        </h3>
        {/* Badges for translation status */}
        <div className="flex justify-between flex-wrap">
          <Badge variant={(video.status == "queued")?"outline":"ghost"}>Queued</Badge>

          <Badge
            variant={(video.status == "processing") ? "outline" : "ghost"}
            className={video.status === "processing" ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300": ""}
          >
            Processing
            {video.status === "processing" && (
              <Spinner className="ml-2 inline-block align-middle" data-icon="inline-end" />
            )}
          </Badge>
          <Badge 
            variant={(video.status == "ready")?"outline":"ghost"} 
            className={(video.status== "ready")?"bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300":""}
          >
            Ready
          </Badge>
          <Badge 
            variant={(video.status == "failed")?"outline":"ghost"}
            className={(video.status === "failed")? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300": ""}
          >
            Failed
          </Badge>
        </div>

        
        {/* Export button: enabled only when video status is ready*/}
        <div style={{marginTop: "40px"}}>
          <Button
            type = "button"
            variant="secondary"
            disabled={video.status !== "ready"}
            className="w-full h-12 rounded-md border border-gray-300 bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300 hover:shadow disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:shadow-none disabled:cursor-not-allowed"
            onClick={() => {
              console.log("Export requested for video", video.id);
            }}
            >
              Export
          </Button>
          {video.status !== "ready" && (
            <p style={{ marginTop: "8px", color: "#666", fontSize: "12px"}}>
              Export will be available when the translation is <strong>Ready</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
