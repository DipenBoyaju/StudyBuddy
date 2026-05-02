import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers({
    url: "https://studybuddy-bkd.onrender.com/api/uploadthing"
  });