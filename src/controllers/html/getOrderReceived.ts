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
    <style>
        @media screen {
            @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;900&display=swap');
        }  

        body {
            font-family: 'Work Sans', Arial, sans-serif!important;
        }    
        @media only screen and (max-width: 600px) {
            .text-responsive {
                font-size: 13px !important;
            }

            .image-responsive {
                width: 90px !important;
                height: 90px !important;
            }
        }
    </style>
</head>
<body style="background-color: #F5FDFF; text-align: center; margin: 0; padding: 0; font-weight: 400">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; padding: 5px;">
        <tr>
            <td>
                <h1 style="font-size: 35px; font-weight: 900; margin-bottom: 30px;">Veplo</h1>
            </td>
        </tr>
        <tr>
            <td>
                <img style="width: 250px; margin-bottom: 15px;" 
                src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/ordineCompletato.png"  
                alt=""/>
            </td>
        </tr>
        <tr>
            <td>
                <div style="height: 100%; background-color: #DFF9FF; border-radius: 15px; padding: 16px 32px; margin: auto;">
                    <p style="font-family: 'Work Sans', sans-serif; font-size: 18px; font-weight: 500;">Ciao ${order.recipient.name},</p>
                    <p style="font-family: 'Work Sans', sans-serif; font-size: 18px; font-weight: 500;">Abbiamo ricevuto il tuo ordine! Ti informeremo non appena il pacco verrà spedito.</p>
                    <a href="https://www.veplo.it/" target="_blank" style="cursor: pointer;"><button style="background-color: #37D1A9; border: none; padding: 12px 24px; border-radius: 5px; color: white; font-size: 16px; font-weight: 600; margin-top: 6px; margin-bottom:8px;">MONITORA ORDINE</button></a>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <h2 style="font-size: 18px; font-weight: 700; margin: 0; margin-bottom: 15px; margin-top: 15px;">Ordine ${order.code}</h2>
                <hr/>
            </td>
        </tr>   
        ${getOrderItems()}
        <tr>
            <td>
                <hr />
                <div style="font-size: 16px;">
                    <div style="float: left; text-align: start;">
                        <p class="text-responsive" style="font-size: 16px; font-weight: 400;">Subtotale</p>
                        <p class="text-responsive" style="font-size: 16px; font-weight: 400;">Spedizione</p>
                    </div>
                    <div style="float: right; text-align: end;">
                        <p class="text-responsive" style="font-size: 16px; font-weight: 400;">${getStandardItalianPrice(order.totalDetails.subTotal)}€</p>
                        <p class="text-responsive" style="font-size: 16px; font-weight: 400;">${order.totalDetails.amountShipping == 0 ? "gratis" : getStandardItalianPrice(order.totalDetails.amountShipping) + "€"}</p>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <hr />
                <div style="font-size: 16px;">
                    <div style="float: left;" style="text-align: start;">
                        <p class="text-responsive" style="font-weight: 600; font-size: 16px;">Totale</p>
                    </div>

                    <div style="float: right;" style="text-align: end;">
                        <p class="text-responsive" style="font-size: 16px; font-weight: 400;">${getStandardItalianPrice(order.totalDetails.total)}€</p>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div style="margin-top: 32px; margin-bottom: 24px;">
                    <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 12px;">INFORMAZIONE SPEDIZIONE</h2>
                    <p style="margin: 0; font-size: 16px; font-weight: 400;">${order.recipient.name}</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 400;">${order.recipient.address.line1}</p>
                    <p  style="margin: 0; font-size: 16px; font-weight: 400;">${order.recipient.address.city}, ${order.recipient.address.state} ${order.recipient.address.postalCode}</p>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div style="height: 100%; background-color: #FFFFFF; border-radius: 15px; padding: 16px 28px 32px 32px; margin: 20px auto;">
                    <h2 style="font-size: 20px; font-weight: 600;">Hai qualche domanda?</h2>
                    <a style="text-decoration: none;" href="https://www.veplo.it/" target="_blank">
                        <img style="width: 30px;" 
                            src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/callCenter.png"  
                            alt="immagine non trovata"
                    />
                        <p style="margin: 0; margin-top: 10px; font-size: 18px; font-weight: 500; color: black;">contattaci</p>
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 18px; text-align: center;">
                <a href="https://www.instagram.com/veplo_it/" target="_blank">
                    <img style="width: 20px;" 
                    src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/instagram.png"  
                    alt="immagine non trovata"
                    />
                </a>
            
                <p style="margin: 0; margin-top: 2px; font-size: 12px; font-weight: 500;">Veplo S.r.l.</p>
                <p style="margin: 0; font-size: 12px; font-weight: 500;">Via Cavour 41, 05100 Terni</p>
            </td>
        </tr>
    </table>
</body>
</html> 
  `;
};
