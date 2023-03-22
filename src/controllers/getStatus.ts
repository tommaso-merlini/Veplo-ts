export const getStatus = (status) => {
  let returnedStatus;

  if (status !== "paid") {
    returnedStatus = "CRE01";
  }

  if (status === "paid") {
    returnedStatus = "PAY01";
  }

  return returnedStatus;
};
