type Args = {
  tokenId: string;
  ids: string[];
  isBusiness: Boolean;
  isAdmin?: Boolean;
  checkIsBusiness?: Boolean;
};

const authenticateToken = ({
  tokenId,
  ids,
  isBusiness,
  isAdmin,
  checkIsBusiness,
}: Args) => {
  // console.log(tokenId);
  // console.log(id);

  if (isAdmin) return; //skip the authorization

  let match = false;
  let needToCheckIsBusiness = true;

  if (checkIsBusiness === false) {
    needToCheckIsBusiness = false;
  }

  //check if it is a shop
  if (!isBusiness && needToCheckIsBusiness) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token's owner is not a business",
      },
    });
  }

  //if the userIds from the jwt and the input don't match throw an error
  for (let id of ids) {
    if (tokenId.toString() === id.toString()) {
      match = true;
      break;
    }
  }

  if (!match) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "403",
        customPath: "token",
        customMessage: "token belongs to another business or user",
      },
    });
  }

  return true;
};

export default authenticateToken;
