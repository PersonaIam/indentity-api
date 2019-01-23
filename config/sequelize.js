/**
 * Created by vladtomsa on 27/09/2018
 */
const config = require('./index');
const logger = require('../app/config/logger');

getConfig = (env) => {
    const envConfig = config[env] || config['development'];

    return {
        ...envConfig.database,
        logging: (message) => {
            logger.info(message);
        },
    };
};

module.exports = {
    development: getConfig('development'),
    test: getConfig('test'),
    production: getConfig('production'),
};