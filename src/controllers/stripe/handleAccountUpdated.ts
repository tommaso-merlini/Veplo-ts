import Product from "../../../src/schemas/Product.model.js";
import Shop from "../../../src/schemas/Shop.model.js";
import Business from "../../schemas/Business.model.js";

export const handleAccountUpdated = async (object: any) => {
  const stripeId = object.id;
  const chargesEnabled = object.charges_enabled;
  const detailsSumbitted = object.details_submitted;
  const payoutsEnabled = object.payouts_enabled;
  let status = "";

  // console.log(`id: ${id}`);
  // console.log(`chargesEnabled: ${chargesEnabled}`);
  // console.log(`detailsSumbitted: ${detailsSumbitted}`);
  // console.log(`payoutsEnabled: ${payoutsEnabled}`);

  const business = await Business.findOne({
    "stripe.id": stripeId,
  });

  if (detailsSumbitted === false) {
    if (business.status === "active") {
      //check if the business was alreay created
      status = "onboarding_KYC_requested"; //! punto 4
      await Business.updateOne(
        { "stripe.id": stripeId },
        {
          status,
        }
      );
    } else {
      status = "onboarding_KYC_requested_first_time"; //! punto 2
      await Business.updateOne(
        { "stripe.id": stripeId },
        {
          status,
        }
      );
    }
  }

  if (
    detailsSumbitted === true &&
    (payoutsEnabled === false || chargesEnabled === false)
  ) {
    if (business.status === "active") {
      //check if the business was alreay created
      status = "pending"; //! punto 5
      await Business.updateOne(
        { "stripe.id": stripeId },
        {
          status,
        }
      );
    } else {
      status = "pending_first_time"; //! punto 3
      await Business.updateOne(
        { "stripe.id": stripeId },
        {
          status,
        }
      );
    }
  }

  if (
    detailsSumbitted === true &&
    payoutsEnabled === true &&
    chargesEnabled === true
  ) {
    status = "active";
    await Business.updateOne(
      { "stripe.id": stripeId },
      {
        status, //! punto 1
      }
    );
  }

  // status = "abc";

  //edit all shops and products
  await Promise.all([
    Shop.updateMany(
      {
        businessId: business.id,
      },
      {
        businessStatus: status,
      }
    ),
    Product.updateMany(
      {
        "shopInfo.businessId": business.id,
      },
      {
        "shopInfo.businessStatus": status,
      }
    ),
  ]);
};
