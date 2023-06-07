import { ProductVariationsOrder } from "src/graphQL/types/types.js";
import { getStandardItalianPrice } from "../getStandardItalianPrice.js";

export const orderItem = (item: ProductVariationsOrder) => {
  return `
        <tr>
            <td>
                <div style="height: 100%; float: left; margin-top: 5px; margin-bottom: 5px; display: flex; align-items: center;">
                    <img class="image-responsive" style="width: 110px; height: 110px; border-radius: 5px; margin-right: 10px;" src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/${item.photo}" alt="immagine non trovata" />
                    <div style="float: right;">
                        <p class="text-responsive" style="text-align: left; font-size: 16px; margin: 3px;  font-weight: 600;">${item.name} (${item.color})</p>
                        <p class="text-responsive" style="text-align: left; font-size: 14px; margin: 3px; font-weight: 400; color: #8F8F8F;">${item.brand}</p>
                        <p class="text-responsive" style="text-align: left; font-size: 14px; margin: 3px; font-weight: 400;">${item.size} / Quantità ${item.quantity}</p>
                    </div>
                </div>
                <div style="float: right; margin-top: 60px;">
                    <span class="text-responsive" style="font-size: 16px; font-weight: 400;">${item.price.v2 != null ? getStandardItalianPrice(item.price.v2) : getStandardItalianPrice(item.price.v1)}€</span>
                </div>
            </td>
        </tr>
  `;
};
