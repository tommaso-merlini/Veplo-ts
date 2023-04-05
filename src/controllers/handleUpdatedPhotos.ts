import customError from "./errors/customError.js";

const handleUpdatedPhotos = async (updatedPhotos: string[]) => {
  if (updatedPhotos.length < 2) {
    customError({
      code: "400",
      path: "photos",
      message: "the user must upload at least two photos",
    });
  }
};

export default handleUpdatedPhotos;
