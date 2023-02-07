import deleteFromSpaces from "./deleteFromSpaces";
import customError from "./errors/customError";

const handleUpdatedPhotos = async (photos, updatedPhotos) => {
  if (updatedPhotos.length < 2) {
    customError({
      code: "400",
      path: "photos",
      message: "the user must upload at least two photos",
    });
  }

  //delete the removed photos
  const removedPhotos = photos.filter((x) => updatedPhotos.indexOf(x) === -1);

  if (removedPhotos.length > 0) {
    await deleteFromSpaces(removedPhotos);
  }
};

export default handleUpdatedPhotos;
