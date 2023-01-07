import { Blob } from "buffer";

const streamToBlob = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream
      .on("data", (chunk) => chunks.push(chunk))
      .once("end", () => {
        var blob = Buffer.concat(chunks);
        resolve(blob);
      })
      .once("error", reject);
  });
};

export default streamToBlob;
