export const checkPostCode = async (prisma, postCode) => {
    const searchedCap = await prisma.cap.findFirst({
        where: {
          cap: postCode,
        },
      });
      if (searchedCap) {
        return true;
      } else {   
        return false;
      }
}