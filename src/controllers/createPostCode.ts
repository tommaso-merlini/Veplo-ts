export const createPostCode = async (prisma, postCode, city, center) => {
    const newCap = await prisma.cap.create({
        data: {
        cap: postCode,
        location: {
            type: "Point",
            coordinates: [center.coordinates[0], center.coordinates[1]]
        },
        city
        }
    })
}