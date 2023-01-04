import { Blob } from "buffer";

const streamToBlob = (stream) => {
  //   if (mimeType != null && typeof mimeType !== "string") {
  //     throw new Error("Invalid mimetype, expected string.");
  //   }
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream
      .on("data", (chunk) => chunks.push(chunk))
      .once("end", () => {
        // const blob =
        //   mimeType != null
        //     ? new Blob(chunks, { type: mimeType })
        //     : new Blob(chunks);
        var blob = Buffer.concat(chunks);
        resolve(blob);
      })
      .once("error", reject);
  });
};

export default streamToBlob;
