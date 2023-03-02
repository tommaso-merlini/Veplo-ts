import Business from "../../schemas/Business.model";

export const handleAccountUpdated = async (object) => {
  const id = object.id;
  const chargesEnabled = object.charges_enabled;
  const detailsSumbitted = object.details_submitted;
  const payoutsEnabled = object.payouts_enabled;
  const metadata = object.metedata;

  console.log(`id: ${id}`);
  console.log(`chargesEnabled: ${chargesEnabled}`);
  console.log(`detailsSumbitted: ${detailsSumbitted}`);
  console.log(`payoutsEnabled: ${payoutsEnabled}`);

  if (detailsSumbitted === false) {
    console.log("qui1");
    await Business.updateOne(
      { _id: id },
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
    console.log("qui2");
    await Business.updateOne(
      { _id: id },
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
    console.log("qui3");
    await Business.updateOne(
      { _id: id },
      {
        status: "active",
      }
    );
    return;
  }
};
