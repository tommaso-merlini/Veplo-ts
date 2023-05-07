import { Order } from "../../graphQL/types/types.js";
import sgMail from "@sendgrid/mail";
import { getOrderReceived } from "../../controllers/html/getOrderReceived.js";
import dotenv from "dotenv";
dotenv.config();

export const sendOrderReceived = async (order: Order) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: ["tommaso.merlini.2004@gmail.com", "nicolo.merlini@gamil.com"], // Change to your recipient
    from: "info@veplo.it", // Change to your verified sender
    subject: "Ordine Ricevuto!",
    html: getOrderReceived(order),
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
