import { Stream } from "stream";

const streamToBlob = (stream: Stream) => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
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
