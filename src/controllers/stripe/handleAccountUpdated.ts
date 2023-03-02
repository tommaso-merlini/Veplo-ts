export const handleAccountUpdated = (object) => {
  const id = object.id;
  const chargesEnabled = object.charges_enabled;
  const detailsSumbitted = object.details_submitted;
  const payoutsEnabled = object.payouts_enabled;
  const metadata = object.metedata;

  if (
    detailsSumbitted === true &&
    (chargesEnabled || payoutsEnabled === false)
  ) {
    console.log("pending");
  }
  console.log(id);
};
