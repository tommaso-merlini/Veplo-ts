const checkObjectID = (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
    } else {
      throw Object.assign(new Error("Error"), {
        extensions: {
          customCode: "422",
          customPath: "id",
          customMessage: "the id provided is not a valid ObjectID",
        },
      });
    }
}

export default checkObjectID;