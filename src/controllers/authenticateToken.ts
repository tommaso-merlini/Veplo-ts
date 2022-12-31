const authenticateToken = (tokenId: string, id: string, isShop: Boolean) => {
  // console.log(tokenId);
  // console.log(id);

  //check if it is a shop
  if (!isShop) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token's owner is not a shop",
      },
    });
  }

  //if the userIds from the jwt and the input don't match throw an error
  if (tokenId != id) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token belongs to another shop",
      },
    });
  }

  return true;
};

export default authenticateToken;
