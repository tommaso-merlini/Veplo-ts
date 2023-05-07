import { Order } from "../../graphQL/types/types.js";
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

  return `<body data-new-gr-c-s-loaded="14.1088.0" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#F5F5F5">
    <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f5f5f5"></v:fill>
			</v:background>
		<![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F5F5F5">
      <tbody>
        <tr>
          <td valign="top" style="padding:0;Margin:0">
            <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                      <tbody>
                        <tr>
                          <td class="esdev-adapt-off" align="left" style="padding:20px;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="esdev-mso-table" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                              <tbody>
                                <tr>
                                  <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                                    <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                      <tbody>
                                        <tr>
                                          <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:174px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                              <tbody>
                                                <tr>
                                                  <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><img src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/veplo_logo.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Logo" height="50"></td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%; margin-top: -60px">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                      <tbody>
                        <tr class="es-mobile-hidden">
                          <td class="es-m-p10t" align="left" style="Margin:0;padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:35px">
                            <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:130px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td class="es-m-p0r" align="center" style="padding:0;Margin:0;width:120px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="es-hidden" style="padding:0;Margin:0;width:10px"></td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:131px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td align="center" style="padding:0;Margin:0;width:121px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0">
                                            
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="es-hidden" style="padding:0;Margin:0;width:10px"></td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:141px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td align="center" style="padding:0;Margin:0;width:141px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0">
                                                                                   </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:10px"></td><td style="width:148px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding:0;Margin:0;width:148px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="left" style="padding:0;Margin:0">
                                            
                                           
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                        <tr>
                          <td class="es-m-p20r" align="left" style="padding:0;Margin:0;padding-left:20px;padding-top:30px;padding-bottom:40px">
                            <!--[if mso]><table style="width:580px" cellpadding="0" cellspacing="0"><tr><td style="width:580px" valign="top"><![endif]-->
                            <table cellspacing="0" cellpadding="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr class="es-mobile-hidden"></tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td width="undefined" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding:0;Margin:0;width:580px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/order_received.png" alt="" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="300"></td>
                                        </tr>
                                        <tr>
                                          <td align="center" class="es-m-p30t es-m-txt-c" style="padding:0;Margin:0;padding-top:20px; padding-right: 20px">
                                            <h1 style="Margin:0;line-height:53px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:44px;font-style:normal;font-weight:900;color:#2a2a2a">Ordine Ricevuto</h1>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px">
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#909090;font-size:14px">Abbiamo appena avvertito ${
                                              order.shop.name
                                            } del tuo ordine, spedira' il pacco all'indirizzo ${
    order.recipient.address.city
  }, ${order.recipient.address.line1}</p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:20px"><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#F1BA0A;border-width:0px;display:inline-block;border-radius:30px;width:auto;mso-hide:all"><a href="https://www.veplo.it/orders/${
                                            order.id
                                          }" class="es-button msohide" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#0F181A;font-size:16px;padding:10px 30px 10px 30px;display:inline-block;background:#F1BA0A;border-radius:30px;font-family:Nunito, Roboto, sans-serif;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center;mso-hide:all"><img src="https://tlr.stripocdn.email/content/guids/CABINET_735fa1136be6e772042e79c4719995b1/images/download_9.png" alt="icon" width="20" style="display:inline-block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:middle;margin-right:10px" align="absmiddle">Monitora ordine</a></span>
                                            <!--<![endif]-->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:5px"></td><td width="undefined" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tbody>
                                <tr class="es-mobile-hidden"></tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                      <tbody>
                        
                        <tr>
                          <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:40px">
                            <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="left" style="padding:0;Margin:0;padding-bottom:20px">
                                            <h2 style="Margin:0;line-height:38px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:32px;font-style:normal;font-weight:bold;color:#2a2a2a">Prezzi</h2>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="left" style="padding:0;Margin:0">
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#909090;font-size:14px">Subtotale:&nbsp;<strong style="color: #2a2a2a">€${
                                              order.totalDetails.subTotal
                                            }</strong></p>
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#909090;font-size:14px">Costo di Spedizione:&nbsp;<strong style="color: #2a2a2a">€${
                                              order.totalDetails.amountShipping
                                            }</strong></p>
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#909090;font-size:14px">Totale:&nbsp;<strong style="color: #2a2a2a"><strong>€${
                                              order.totalDetails.total
                                            }</strong></p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding:0;Margin:0;width:270px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="left" style="padding:0;Margin:0;padding-bottom:20px">
                                            <h2 style="Margin:0;line-height:38px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:32px;font-style:normal;font-weight:bold;color:#2a2a2a">Indirizzo di spedizione</h2>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="left" style="padding:0;Margin:0">
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#909090;font-size:14px">Destinatario:&nbsp;<strong style="color: #2a2a2a">${
                                              order.recipient.name
                                            }</strong></p>
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#909090;font-size:14px">Indirizzo:&nbsp;<strong style="color: #2a2a2a">${
                                              order.recipient.address.city
                                            }, ${
    order.recipient.address.line1
  } - ${order.recipient.address.line2}</strong></p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table bgcolor="#fafafa" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#fafafa;width:600px">
                      <tbody>
                        <tr>
                          <td align="left" style="padding:20px;Margin:0">
                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px">
                                            <h2 style="Margin:0;line-height:38px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:26px;font-style:normal;font-weight:900;color:#2a2a2a">ordine #${
                                              order.code
                                            }</h2>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                                              ${getOrderItems()}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table bgcolor="#fafafa" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#fafafa;width:600px">
                      <tbody>
                        <tr>
                          <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px">
                            <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" align="left" class="es-left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="padding:0;Margin:0;width:270px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding:35px;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#F1BA0A;font-size:14px"><img src="https://tlr.stripocdn.email/content/guids/CABINET_37fa9af71c93e641990ef539715b0b24/images/onlinepayment_4.png" alt="" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="200"></a></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding:0;Margin:0;width:270px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                            <h2 style="Margin:0;line-height:38px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:32px;font-style:normal;font-weight:normal;color:#0F181A">Siamo qui per aiutarti</h2>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px"><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#F1BA0A;border-width:0px;display:inline-block;border-radius:30px;width:auto;mso-hide:all"><a href="mailto:fresh_in_box@email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#0F181A;font-size:16px;padding:10px 30px 10px 30px;display:inline-block;background:#F1BA0A;border-radius:30px;font-family:Nunito, Roboto, sans-serif;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center">assistenza@veplo.it<img src="https://tlr.stripocdn.email/content/guids/CABINET_37fa9af71c93e641990ef539715b0b24/images/group_361.png" alt="icon" width="20" align="absmiddle" style="display:inline-block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:middle;margin-left:10px"></a></span>
                                            <!--<![endif]-->
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#0F181A;font-size:14px">puoi anche contattarci tramite social</p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0">
                                            <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                              <tbody>
                                                <tr>
<!--                                                   <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#F1BA0A;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/circle-black/facebook-circle-black.png" alt="Fb" title="Facebook" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#F1BA0A;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/circle-black/twitter-circle-black.png" alt="Tw" title="Twitter" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> -->
                                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#F1BA0A;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/circle-black/instagram-circle-black.png" alt="Ig" title="Instagram" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
<!--                                                   <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#F1BA0A;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/messenger-icons/circle-black/telegram-circle-black.png" alt="Telegram" title="Telegram" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td> -->
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                      <tbody>
                        <tr>
                          <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;padding-bottom:40px">
                            <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:105px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;width:85px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#F1BA0A;font-size:14px"><img src="https://tlr.stripocdn.email/content/guids/CABINET_37fa9af71c93e641990ef539715b0b24/images/restaurant.png" alt="" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="85"></a></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="es-hidden" style="padding:0;Margin:0;width:20px"></td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:185px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td class="es-m-p20b" align="center" style="padding:0;Margin:0;width:165px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px">
                                            <h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#2a2a2a">Scopri nuovi negozi</h3>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px">
                                            <!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
	<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                style="height:39px; v-text-anchor:middle; width:157px" arcsize="50%" stroke="f"  fillcolor="#f1ba0a">
		<w:anchorlock></w:anchorlock>
		<center style='color:#0f181a; font-family:Nunito, Roboto, sans-serif; font-size:14px; font-weight:700; line-height:14px;  mso-text-raise:1px'>Google Maps</center>
	</v:roundrect></a>
<![endif]-->
                                            <!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#F1BA0A;border-width:0px;display:inline-block;border-radius:30px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#0F181A;font-size:16px;padding:10px 30px 10px 30px;display:inline-block;background:#F1BA0A;border-radius:30px;font-family:Nunito, Roboto, sans-serif;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center">Andiamo!</a></span>
                                            <!--<![endif]-->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td class="es-hidden" style="padding:0;Margin:0;width:20px"></td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:85px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td class="es-m-p20b" align="center" style="padding:0;Margin:0;width:85px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#F1BA0A;font-size:14px"><img src="https://tlr.stripocdn.email/content/guids/CABINET_37fa9af71c93e641990ef539715b0b24/images/noodles.png" alt="" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="85"></a></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:20px"></td><td style="width:165px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tbody>
                                <tr>
                                  <td align="center" style="padding:0;Margin:0;width:165px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px">
                                            <h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#2a2a2a">Visita Caracas</h3>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px">
                                            <!--[if mso]><a href="https://viewstripo.email" target="_blank" hidden>
	<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://viewstripo.email" 
                style="height:39px; v-text-anchor:middle; width:152px" arcsize="50%" stroke="f"  fillcolor="#f1ba0a">
		<w:anchorlock></w:anchorlock>
		<center style='color:#0f181a; font-family:Nunito, Roboto, sans-serif; font-size:14px; font-weight:700; line-height:14px;  mso-text-raise:1px'>Watch video</center>
	</v:roundrect></a>
<![endif]-->
                                            <!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#F1BA0A;border-width:0px;display:inline-block;border-radius:30px;width:auto;mso-hide:all"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#0F181A;font-size:16px;padding:10px 30px 10px 30px;display:inline-block;background:#F1BA0A;border-radius:30px;font-family:Nunito, Roboto, sans-serif;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center">Let's go!</a></span>
                                            <!--<![endif]-->
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#0F181A;width:600px">
                      <tbody>
                        <tr>
                          <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px">
                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tbody>
                                <tr>
                                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://www.veplo.it" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#FFFFFF;font-size:14px">
                                            <span style="font-size: 36px; font-weight: 900">Veplo</span>
                                          </a></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:25px;padding-bottom:40px">
                            <!--[if mso]><table style="width:560px" cellpadding="0" 
                        cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tbody>
                                <tr>
                                  <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="left" class="es-m-txt-c" style="padding:0;Margin:0">
                                            <h3 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#ffffff"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#FFFFFF;font-size:20px;line-height:30px" href="https://viewstripo.email">Help center</a></h3>
                                            <h3 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#ffffff"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#FFFFFF;font-size:20px;line-height:30px" href="https://viewstripo.email">Terms</a></h3>
                                            <h3 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#ffffff"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#FFFFFF;font-size:20px;line-height:30px" href="https://viewstripo.email">Privacy</a></h3>
                                            <h3 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#ffffff"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#FFFFFF;font-size:20px;line-height:30px" href="">Unsubscribe</a></h3>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding:0;Margin:0;width:270px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tbody>
                                        <tr>
                                          <td align="right" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:30px;font-size:0">
                                            <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                              <tbody>
                                                <tr>
                                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb" title="Facebook" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/circle-white/twitter-circle-white.png" alt="Tw" title="Twitter" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                  <td align="center" valign="top" style="padding:0;Margin:0;padding-right:10px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png" alt="Ig" title="Instagram" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                  <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/circle-white/youtube-circle-white.png" alt="Yt" title="Youtube" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="right" class="es-m-txt-c" style="padding:0;Margin:0">
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">Fresh in box. Inc.,</p>
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">5675 Silver Wharf, Chicago Creek, Connecticut, 06331-6807, US</p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
              <tbody>
                <tr>
                  <td align="center" style="padding:0;Margin:0">
                    <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                      <tbody>
                        <tr>
                          <td align="left" style="padding:20px;Margin:0">
                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                     
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</body>
`;
};
