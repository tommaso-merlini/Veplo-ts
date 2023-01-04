const getUpdatedPhotosId = (productPhotos, deletedPhotos, newPhotos) => {
  let returnedPhotos = productPhotos;

  //remove the deletedPhotos
  if (deletedPhotos !== undefined && deletedPhotos !== null) {
    for (let i = 0; i < productPhotos.length; i++) {
      for (let k = 0; k < deletedPhotos.length; k++) {
        if (productPhotos[i] === deletedPhotos[k]) {
          delete returnedPhotos[i];
        }
      }
    }
  }

  //add the newPhotos
  if (newPhotos !== null && newPhotos !== undefined) {
    returnedPhotos = returnedPhotos.concat(newPhotos);
  }

  return returnedPhotos;
};

export default getUpdatedPhotosId;
