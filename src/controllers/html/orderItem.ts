import { ProductVariationsOrder } from "src/graphQL/types/types.js";
import { getStandardItalianPrice } from "../getStandardItalianPrice.js";

export const orderItem = (item: ProductVariationsOrder) => {
  return `
  <tr>
        <td>
            <div style="height: 100%; float: left;">
                <img style="width: 80px; height: 80px; border-radius: 5px; margin-right: 10px;" src="https://loremflickr.com/100/100" alt="immagine non trovata" />
                <div style="float: right;"> 
                    <p style="text-align: left; font-size: 10px; margin: 3px; font-size: 10px; font-weight: 600;">${item.name} (${item.color})</p>
                    <p style="text-align: left; font-size: 10px; margin: 3px; font-size: 8px; font-weight: 400;">${item.brand}</p>
                    <p style="text-align: left; font-size: 10px; margin: 3px; font-size: 8px; font-weight: 400;">${item.size} / Quantità ${item.quantity}</p>
                </div>
            </div>
            <div style="float: right;"">
                <p style="font-size: 10px; font-weight: 400;">${getStandardItalianPrice(item.price.v2)}&euro</p>
            </div>
        </td>
    </tr>
  `;
};
