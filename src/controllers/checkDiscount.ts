const checkDiscount = (discount) => {
  if (discount >= 100 || discount <= 0) {
    throw Object.assign(new Error("Error"), {
      extensions: {
        customCode: "422",
        customPath: "discount",
        customMessage: "discount has to be greater than 0 and lower than 100",
      },
    });
  }
};

export default checkDiscount;
