import { Order } from "../../graphQL/types/types.js";
import { getStandardItalianPrice } from "../getStandardItalianPrice.js";
import { orderItem } from "./orderItem.js";

export const getOrderReceived = (order: Order) => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0"); //aggiungi uno zero iniziale se il giorno è inferiore a 10
  const italianMonths = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  const month = italianMonths[date.getMonth()];
  const year = date.getFullYear().toString();
  const formattedDate = `${day} ${month} ${year}`;

  const getOrderItems = () => {
    let itemsHtml = "";
    for (let variation of order.productVariations) {
      console.log("=============================");
      console.log(variation);
      console.log("=============================");
      const newItemHtml = orderItem(variation);
      itemsHtml = itemsHtml + newItemHtml;
    }
    return itemsHtml;
  };

  return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Veplo</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;900&display=swap" rel="stylesheet">
</head>
<body style="background-color: #F5FDFF; text-align: center; margin: 0 auto; padding: 20px; width: 400px; font-family: 'Work Sans', sans-serif; font-weight: 400">
    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
    <tr>
        <td>
            <h1 style="font-size: 30px; font-weight: 900;">Veplo</h1>
        </td>
    </tr>
    <tr>
        <td>
            <img style="width: 200px;" src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/undraw_order_delivered_re_v4ab.svg"  alt="immagine non trovata"/>
        </td>
    </tr>
    <tr>
        <td>
            <div style="width: 300px; height: 100%; background-color: #DFF9FF; border-radius: 15px; padding: 16px 32px; margin: 28px auto;">
                <p style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;">Ciao ${order.recipient.name},</p>
                <p style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;">Abbiamo ricevuto il tuo ordine! Ti informeremo non appena il pacco verrà spedito.</p>
                <a href="https://www.veplo.it/" target="_blank"><button style="background-color: #37D1A9; border: none; padding: 8px 16px; border-radius: 5px; color: white; font-size: 12px; font-weight: 600; margin-top: 12px; cursor: pointer;">MONITORA ORDINE</button></a>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <h2 style="font-size: 13px; font-weight: 700; margin: 0;">Ordine ${order.code}</h2>
            <hr />
        </td>
    </tr>
    ${getOrderItems()}
    <tr>
        <td>
            <hr />
            <div style="font-size: 10px;">
                <div style="float: left; text-align: start;">
                    <p style="font-size: 10px; font-weight: 400;">Subtotale</p>
                    <p style="font-size: 10px; font-weight: 400;">Spedizione</p>
                </div>

                <div style="float: right; text-align: end;">
                    <p style="font-size: 10px; font-weight: 400;">${getStandardItalianPrice(order.totalDetails.subTotal)}€</p>
                    <p style="font-size: 10px; font-weight: 400;">
                    ${order.totalDetails.amountShipping == 0 ? "gratis" : getStandardItalianPrice(order.totalDetails.amountShipping) + "€"}
                    </p>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <hr />
            <div style="font-size: 10px;">
                <div style="float: left;" style="text-align: start;">
                    <p style="font-weight: 600; font-size: 10px;">Totale</p>
                </div>

                <div style="float: right;" style="text-align: end;">
                    <p style="font-size: 10px; font-weight: 400;">${getStandardItalianPrice(order.totalDetails.total)}€</p>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div style="margin-top: 32px; margin-bottom: 24px;">
                <h2 style="font-size: 10px; font-weight: 700; margin-bottom: 12px;">INFORMAZIONE SPEDIZIONE</h2>
                <p style="margin: 0; font-size: 10px; font-weight: 400;">${order.recipient.name}</p>
                <p style="margin: 0; font-size: 10px; font-weight: 400;">${order.recipient.address.line1}</p>
                <p  style="margin: 0; font-size: 10px; font-weight: 400;">${order.recipient.address.city}, ${order.recipient.address.state} ${order.recipient.address.postalCode}</p>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div style="width: 300px; height: 100%; background-color: #FFFFFF; border-radius: 15px; padding: 16px 32px; margin: 28px auto;">
                <h2 style="font-size: 12px; font-weight: 700;">Hai qualche domanda?</h2>
                <a style="text-decoration: none;" href="https://www.veplo.it/" target="_blank">
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M20 11a8 8 0 10-16 0" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 15.438v-1.876a2 2 0 011.515-1.94l1.74-.436a.6.6 0 01.745.582v5.463a.6.6 0 01-.746.583l-1.74-.435A2 2 0 012 15.439zM22 15.438v-1.876a2 2 0 00-1.515-1.94l-1.74-.436a.6.6 0 00-.745.582v5.463a.6.6 0 00.745.583l1.74-.435A2 2 0 0022 15.439zM20 18v.5a2 2 0 01-2 2h-3.5" stroke="#000000" stroke-width="1.5"></path><path d="M13.5 22h-3a1.5 1.5 0 010-3h3a1.5 1.5 0 010 3z" stroke="#000000" stroke-width="1.5"></path></svg>
                    <p style="margin: 0; font-size: 10px; font-weight: 600; color: black;">contattaci</p>
                </a>
            </div>
        </td>
    </tr>
    <tr>
        <td style="padding: 20px; text-align: center;">
            <a href="https://www.instagram.com/veplo_it/" target="_blank">
                <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 16a4 4 0 100-8 4 4 0 000 8z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 16V8a5 5 0 015-5h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5z" stroke="#000000" stroke-width="1.5"></path><path d="M17.5 6.51l.01-.011" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </a>
            <p style="margin: 0; margin-top: 10px; font-size: 6px; font-weight: 500;">Veplo S.r.l.</p>
            <p style="margin: 0; font-size: 6px; font-weight: 500;">Via Cavour 41, 05100 Terni</p>
        </td>
    </tr>
</table>
</body>
</html>
  `;
};
