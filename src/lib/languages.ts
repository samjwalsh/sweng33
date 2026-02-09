export enum LanguageName {
  Chinese = "Chinese",
  English = "English",
  Japanese = "Japanese",
  Korean = "Korean",
  German = "German",
  French = "French",
  Russian = "Russian",
  Portuguese = "Portuguese",
  Spanish = "Spanish",
  Italian = "Italian",
}

export const languageValues = Object.values(LanguageName) as [
  LanguageName,
  ...LanguageName[],
];