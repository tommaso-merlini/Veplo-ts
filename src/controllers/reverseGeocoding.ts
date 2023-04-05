import https from "https";

export const reverseGeocoding = async (latitude: number, longitude: number) => {
  // const endpoint = "mapbox.place";
  // const types = ["postcode"];
  //https://api.mapbox.com/geocoding/v5/mapbox.places/42.56231,12.645763.json?types='postcode'&limit=1&country=IT&language=it&access_token=pk.eyJ1Ijoibmljb2xvbGVnYWN5IiwiYSI6ImNsOWVkaGsxZzFzdjEzd3A4eGlubDdnZ3cifQ.G9KaZlNas4WvUgnZiL-d7w
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${latitude},${longitude}.json?limit=1&country=it&language=it&access_token=${process.env.MAPBOX_URI}`;
  // return new Promise((resolve) => {
  //   request({ url: url, json: true }, function (error: Error, response: any) {
  //     if (error) {
  //       throw new Error("Unable to connect to Geocode API");
  //     } else if (response.body.features.length == 0) {
  //       throw new Error("this location is not supported");
  //     } else {
  //       const body = {
  //         center: response.body.features[0].geometry,
  //         city: response.body.features[0].context[1].text_it,
  //         postCode: response.body.features[0].context[0].text_it,
  //       };

  //       resolve(body);
  //     }
  //   });
  // });
  try {
    const response = await https.get(url);
    // const body = {
    //   center: response.body.features[0].geometry,
    //   city: response.body.features[0].context[1].text_it,
    //   postCode: response.body.features[0].context[0].text_it,
    // };
    console.log(response);
  } catch (e) {}
};
