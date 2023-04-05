import Business from "../../schemas/Business.model.js";

export const handleAccountUpdated = async (object: any) => {
  const id = object.id;
  const chargesEnabled = object.charges_enabled;
  const detailsSumbitted = object.details_submitted;
  const payoutsEnabled = object.payouts_enabled;
  // const metadata = object.metedata;

  // console.log(`id: ${id}`);
  // console.log(`chargesEnabled: ${chargesEnabled}`);
  // console.log(`detailsSumbitted: ${detailsSumbitted}`);
  // console.log(`payoutsEnabled: ${payoutsEnabled}`);
  // console.log(`metadata: ${metadata}`);

  if (detailsSumbitted === false) {
    await Business.updateOne(
      { "stripe.id": id },
      {
        status: "onboarding_KYC_requested",
      }
    );
    return;
  }

  if (
    detailsSumbitted === true &&
    (payoutsEnabled === false || chargesEnabled === false)
  ) {
    await Business.updateOne(
      { "stripe.id": id },
      {
        status: "not_active",
      }
    );
    return;
  }

  if (
    detailsSumbitted === true &&
    payoutsEnabled === true &&
    chargesEnabled === true
  ) {
    await Business.updateOne(
      { "stripe.id": id },
      {
        status: "active",
      }
    );
    return;
  }
};
