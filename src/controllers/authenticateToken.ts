const authenticateToken = (tokenId: string, id: string, isShop: Boolean) => {
  // console.log(tokenId);
  // console.log(id);

  //check if it is a shop
  if (!isShop) {
    throw new Error("this user is not a shop");
  }

  //if the userTokenId or userId is not provided throw an error
  if (!tokenId || !id) {
    throw new Error("unauthorized");
  }

  //if the userIds from the jwt and the input don't match throw an error
  if (tokenId != id) {
    throw new Error("incorrect authorization");
  }

  return true;
};

export default authenticateToken;
