import customError from "./errors/customError";

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
