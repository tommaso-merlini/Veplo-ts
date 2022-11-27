
const request = require('request');

require("dotenv").config();

export const reverseGeocoding = async (latitude: Float32Array, longitude: Float32Array) => {
    const endpoint = 'mapbox.place';
    const types = ['postcode']
    const MAPBOX_URI = "pk.eyJ1Ijoibmljb2xvbGVnYWN5IiwiYSI6ImNsOWVkaGsxZzFzdjEzd3A4eGlubDdnZ3cifQ.G9KaZlNas4WvUgnZiL-d7w";
    //https://api.mapbox.com/geocoding/v5/mapbox.places/42.56231,12.645763.json?types='postcode'&limit=1&country=IT&language=it&access_token=pk.eyJ1Ijoibmljb2xvbGVnYWN5IiwiYSI6ImNsOWVkaGsxZzFzdjEzd3A4eGlubDdnZ3cifQ.G9KaZlNas4WvUgnZiL-d7w
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${latitude},${longitude}.json?limit=1&country=IT&language=it&access_token=${process.env.MAPBOX_URI}`
    return new Promise(resolve => {
        request({ url: url, json: true }, function (error, response) {
            if (error) {
                throw new Error('Unable to connect to Geocode API');
            } else if (response.body.features.length == 0) {
                throw new Error('Unable to find location. Try to '
                         + 'search another location.');
            } else {
                const body = {
                    center: response.body.features[0].geometry,
                    city: response.body.features[0].context[1].text_it,
                    postCode: response.body.features[0].context[0].text_it
                }
    
                resolve(body)
            }
        })
    })
    
}