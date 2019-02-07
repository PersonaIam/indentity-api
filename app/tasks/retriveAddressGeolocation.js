/**
 * Created by vladtomsa on 08/11/2018
 */
const http = require('axios');
const logger = require('../config/logger');
const contactsController = require('../controllers').contactsController;

const self = {};

const findAddressesGeoLocations = (locations) => {
  if (locations && locations.length) {
      logger.info(`Finding GEOCORDINATES for ${locations.length} addresses`);

      locations.forEach((location) => {
          const { id, address, city, zipCode, country } = location;

          let toSearchAddress = '';

          if (address) toSearchAddress += `${address},`;

          if (city) toSearchAddress += `${city},`;

          if (zipCode) toSearchAddress += `${zipCode},`;

          if (country) toSearchAddress += `${country.name},`;

          http.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${self.googleMapAPIKey}&address=${toSearchAddress}`)
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
                    logger.error(`Failed to load location for contactInfoId: ${id}`);
                    logger.error(error);
                }
            })
            .catch(logger.error);
      })
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
        .catch(error => {
            logger.error(error.message ? error.message : error);
        });
};

const retriveGeolocationJob = (app) => {
    self.app = app;

    const {
        constants: { RETRIVE_ADDRESS_GEOLOCATION_TAKS_INTERVAL },
        googleMapAPIKey,
    } = app.get('config');

    self.googleMapAPIKey = googleMapAPIKey;

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