/*
  Here the user expects to be able to upload a video to our service.
  At the time being there is no actual way to upload the video so just focus on creating a component that is
  able to call the function createVideo.

  I imagine we'll end up with a page with some box in the middle for uploading the file, and some fields the user
  has to fill in, like the title, source language and dest language.
  I have used a type called an enum for the languages which should let you easily swap between the word 'English'
  and the language code 'en' (which is what gets stored in the database)

  Video objects look like this:
  {
    id: "video-1",
    title: "Sample video",
    createdById: "user-1",
    createdAt: new Date(),
    blob: "placeholder-blob",
    status: "ready",
    sourceLanguage: LanguageCode.English, // 'en'
    destLanguage: LanguageCode.Spanish // 'es'
  }

  So you will need to collect most of this data from the user.
  You don't have to worry about the id or createById, or createdAt, these will be filled in automatically later on.

  The user will upload a video by dragging and dropping it or selecting a file on their pc, you can look into a
  thing called 'react-dropzone' for this, should make things easier, but I still need to think a bit more about how
  the file will actually be uploaded.
  It will be something like user uploads file -> call a function -> function returns the blob string.
  The blob string is a url to the video on our servers, so you also don't need to worry about this for now.

  You should be using shadcn components wherever possible.

  Please text me if you need help I know I haven't explained this well enough for you to do it by yourself.

*/

"use client";

import * as React from "react";

import type { Video } from "@/lib/video-type";
import {
  LanguageCode,
  languageCodeValues,
  languageCodeToName,
} from "@/lib/languages";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";

type CreateVideoInput = Omit<Video, "id" | "createdById" | "createdAt">;

export default function VideoUpload() {
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [sourceLanguage, setSourceLanguage] = React.useState<LanguageCode | "">(
    "",
  );
  const [destLanguage, setDestLanguage] = React.useState<LanguageCode | "">("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { "video/*": [] },
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles?.[0] ?? null;
      setFile(selectedFile);
    },
  });

  function handleCreateVideo() {
    if (!file) return;
    if (!title.trim()) return;
    if (!sourceLanguage || !destLanguage) return;
    if (sourceLanguage === destLanguage) return;

    const videoInput: CreateVideoInput = {
      title: title.trim(),
      sourceLanguage,
      destLanguage,
      status: "ready",
      blob: "placeholder-blob",
    };

    createVideo(videoInput);
  }

  return (
    <div className="w-full px-6 py-16">
      <div className="flex min-h-[calc(100vh-6rem)] flex-col space-y-6">
        {/* header */}
        <div className="space-y-5 text-center">
          <h1 className="text-4xl font-semibold">Upload video</h1>
          <p className="text-muted-foreground">
            Upload a video and choose source and destination languages.
          </p>
        </div>

        {/* title */}
        <div className="mx-auto mt-10 w-full max-w-5xl space-y-3">
          <Label htmlFor="title" className="block text-center text-xl">
            Title
          </Label>
          <Input
            id="title"
            placeholder="e.g. My Video"
            className="w-full"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        {/* upload box */}
        <div className="mx-auto mt-10 w-full max-w-5xl">
          <div
            {...getRootProps()}
            className="hover:border-muted-foreground/40 hover:bg-muted/20 flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center transition-colors"
          >
            <input {...getInputProps()} />

            {!file ? (
              <>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? "Drop your video here"
                    : "Drag & drop your video here"}
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to select a file
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Selected file</p>
                <p className="text-muted-foreground text-sm">{file.name}</p>
              </>
            )}
          </div>
        </div>

        {/* language wrapper */}
        <div className="mx-auto mt-8 w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* source language */}
            <div className="space-y-2 md:relative md:left-[-40px]">
              <Label className="font-medium">Source language</Label>
              <Select
                value={sourceLanguage}
                onValueChange={(languageCode) =>
                  setSourceLanguage(languageCode as LanguageCode)
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {languageCodeValues.map((code) => (
                    <SelectItem key={code} value={code}>
                      {languageCodeToName[code]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* destination language */}
            <div className="space-y-2 md:relative md:left-[40px]">
              <Label className="font-medium">Destination language</Label>
              <Select
                value={destLanguage}
                onValueChange={(languageCode) =>
                  setDestLanguage(languageCode as LanguageCode)
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {languageCodeValues.map((code) => (
                    <SelectItem key={code} value={code}>
                      {languageCodeToName[code]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* create video */}
        <div className="mt-10">
          <div className="mx-auto flex w-full max-w-5xl justify-center">
            <Button onClick={handleCreateVideo}>Create video</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function createVideo(input: CreateVideoInput) {
  console.log("createVideo called with:", input);
}
