import Cap from "../schemas/Cap.model";

type Center = {
  coordinates: number[];
};

export const createPostCode = async (
  postCode: string,
  city: string,
  center: Center
) => {
  await Cap.create({
    cap: postCode,
    location: {
      type: "Point",
      coordinates: [center.coordinates[0], center.coordinates[1]],
    },
    city,
  });
};
