export const createPostCode = async (Cap, postCode, city, center) => {
  const newCap = await Cap.create({
    cap: postCode,
    location: {
      type: "Point",
      coordinates: [center.coordinates[0], center.coordinates[1]],
    },
    city,
  });
};
