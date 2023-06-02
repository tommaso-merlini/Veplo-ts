import dotenv from "dotenv";
import customError from "../errors/customError.js";
dotenv.config();

export const calculateApplicationFeeAmount = ({
  total,
  fee,
}: {
  total: number;
  fee: number;
}): number => {
  const transactionFeePercentage: number | undefined =
    +process.env.TRANSACTION_FEE;
  const transactionFeeFixed: number | undefined =
    +process.env.TRANSACTION_FEE_FIXED_IN_CENTS;
  if (
    fee == undefined ||
    transactionFeePercentage == undefined ||
    transactionFeeFixed == undefined
  ) {
    customError({
      code: "400",
      path: "checkout",
      message: "internal server error, contact the assistency",
    });
  }

  const totalInCents = total * 100;
  const applicationFeeAmount =
    totalInCents * fee +
    totalInCents * transactionFeePercentage +
    transactionFeeFixed;

  return +applicationFeeAmount.toFixed(0);
};
