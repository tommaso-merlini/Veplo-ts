export const orderItem = (item: any) => {
  return `
        <tr>
                          <td class="esdev-adapt-off" align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                            <table cellpadding="0" cellspacing="0" class="esdev-mso-table" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                              <tbody>
                                <tr>
                                  <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                                    <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                      <tbody>
                                        <tr>
                                          <td class="es-m-p0r" align="center" style="padding:0;Margin:0;width:174px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                              <tbody>
                                                <tr>
                                                  <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img p_image" src="https://veplo-images.fra1.cdn.digitaloceanspaces.com/${
                                                    item.photo
                                                  }" alt="" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border-radius:20px" width="174"></td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td style="padding:0;Margin:0;width:20px"></td>
                                  <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                                    <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;width:173px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                              <tbody>
                                                <tr>
                                                  <td align="left" style="padding:0;Margin:0;padding-bottom:15px">
                                                    <h3 class="p_name" style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#0F181A">${
                                                      item.name
                                                    } - colore: ${
    item.color
  } - taglia: ${item.size}</h3>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td align="left" style="padding:0;Margin:0">
                                                    <p class="p_description" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Nunito, Roboto, sans-serif;line-height:21px;color:#0F181A;font-size:14px">quantita': ${
                                                      item.quantity
                                                    }</p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td style="padding:0;Margin:0;width:20px"></td>
                                  <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                                    <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding:0;Margin:0;width:173px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                              <tbody>
                                                <tr>
                                                  <td align="right" class="es-m-txt-r" style="padding:0;Margin:0">
                                                    <h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:'Fredoka One', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#0F181A"><b class="p_price">€${
                                                      item.price.v2 ||
                                                      item.price.v1
                                                    }</b></h3>
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
    `;
};
