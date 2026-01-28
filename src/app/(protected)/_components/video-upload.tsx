import type { Video } from "@/lib/video-type";
import type { LanguageCode } from "@/lib/languages";

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

export default function VideoUpload() {
  return <div>this is the ui where the user can upload a video</div>;
}

function CreateVideo(video: Video) {
  return "upload video";
}
