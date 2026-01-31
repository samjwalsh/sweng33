"use client";

import type { Video } from "@/lib/video-type";
/*

Main thing is that there is a prominent download button for the video, but you would probably expect to be able to see all of the info about it like when you uploaded it and maybe a player for the video
The source language and the destination language.
We should probably also have a button to delete the video if the user is done with it.

*/
export default function VideoViewer({ video }: { video: Video }) {
  return <div>{video.title}</div>;
}
