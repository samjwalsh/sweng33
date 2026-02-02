"use client";

import type { Video } from "@/lib/video-type";
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge";
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
        <h1 style={{ marginTop: "30px", fontSize: "40px"}}>{video.title}</h1>

        {/* Video Details */}
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          <p>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</p>
          <p>Source Language: {video.sourceLanguage.toUpperCase()}</p>
          <p>Destination Language: {video.destLanguage.toLocaleUpperCase()}</p>
          
        </div>
      </div>
      {/* Right Side: Translation Progress, Export, etc... */}  
      <div style={{ flex: 1, paddingLeft: "20px", fontSize: "14px", color: "#333" }}>
        <Field className="w-full max-w-sm">
          <FieldLabel htmlFor="progress-upload">
            <span style={{fontSize: "20px"}}>Translation Progress:</span>
            <span className="ml-auto">66%</span>

            {/* TO DO -- Need Progess(int) for progress bar and status for badge */}

          </FieldLabel>
          {/* Progress Bar */}
          <Progress
            value={66}
            id="progress-upload"
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#e0e0e0", // Light gray background
              borderRadius: "5px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "66%", // Matches the value prop
                height: "100%",
                backgroundColor: "#4caf50", // Green progress
              }}
            ></div>
          </Progress>
        </Field>

      </div>
    </div>
  );
}
