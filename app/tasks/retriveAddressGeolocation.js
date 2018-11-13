/**
 * Created by vladtomsa on 08/11/2018
 */
const http = require('axios');
const contactsController = require('../controllers').contactsController;

const self = {};

const findAddressesGeoLocations = (locations) => {
  if (locations && locations.length) {
      console.log(`Finding GEOCORDINATES for ${locations.length} addresses`);
      locations.forEach((location) => {
          const { id, address, city, zipCode, country } = location;

          let toSearchAddress = '';

          if (address) toSearchAddress += `${address},`;

          if (city) toSearchAddress += `${city},`;

          if (zipCode) toSearchAddress += `${zipCode},`;

          if (country) toSearchAddress += `${country.name},`;

          // ToDo change API KEY
          const API_KEY = 'API_KEY_HERE';

          http.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=${toSearchAddress}`)
            .then(async (result) => {
                try {
                    const data = result.data;
                    const results = data.results[0].geometry;
                    const latLng = results.location;

                    await contactsController.update({
                        lat: `${latLng.lat}`,
                        lng: `${latLng.lng}`,
                    }, id);
                }
                catch (error) {
                    console.log(error);
                }
            })
            .catch(console.log);
      })
  }
  else {
      console.log('All addresses have geolocation specified');
  }
};

const searchUnspecifiedGeolocationAddresses = () => {
    contactsController.list({
        lat: null,
        lng: null,
        address: {
            $ne: null
        },
    })
        .then(findAddressesGeoLocations)
        .catch(error => console.log('err: ', error));
};

const retriveGeolocationJob = (app) => {
    self.app = app;

    const {
        RETRIVE_ADDRESS_GEOLOCATION_TAKS_INTERVAL,
    } = app.get('config').constants;

    return {
        interval: {
            seconds: RETRIVE_ADDRESS_GEOLOCATION_TAKS_INTERVAL,
        },
        task: () => {
            searchUnspecifiedGeolocationAddresses();
        }
    };
};

module.exports = retriveGeolocationJob;