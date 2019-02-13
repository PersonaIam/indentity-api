/**
 * Created by vladtomsa on 08/11/2018
 */
const http = require('axios');
const logger = require('../config/logger');
const contactsController = require('../controllers').contactsController;
const utf8 = require('utf8');

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

          http.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${self.googleMapAPIKey}&address=${utf8.encode(toSearchAddress)}`)
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
                    let errorMessage = error.message;

                    if (result && result.data && result.data.error_message) {
                        errorMessage = result.data.error_message;
                    }

                    logger.error(`Failed to update location for contactInfoId: ${id} address: ${toSearchAddress}`);

                    throw new Error(errorMessage);
                }
            })
            .catch(async error => {
                let errorMessage = error.message;

                if (error && error.response && error.response.data && error.response.data.error_message) {
                    logger.error(error.response.data.error_message);

                    errorMessage = error.response.data.error_message;
                }

                try {
                    await contactsController.update({
                        getGeolocationError: errorMessage,
                    }, id);
                }
                catch (error) {
                    logger.error(`Failed to update error ${errorMessage}`);
                }

                logger.error(`Request to GMAPS failed for contactInfoId: ${id} address: ${toSearchAddress}`);
            });
      })
  }
};

const searchUnspecifiedGeolocationAddresses = () => {
    contactsController.list({
        lat: null,
        lng: null,
        getGeolocationError: null,
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