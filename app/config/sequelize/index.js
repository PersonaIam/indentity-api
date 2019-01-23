/**
 * Created by vladtomsa on 27/09/2018
 */
const Sequelize = require('sequelize');
const logger = require('../logger/index');

let sequelizeInstance = null;

const init = (app, cb) => {
    const {
        database: {
            database,
            username,
            password,
            host,
            dialect,
            port,
            pool,
        }
    } = app.get('config');

    const sequelize = new Sequelize(
        database,
        username,
        password,
        {
            operatorsAliases: false,
            host,
            dialect,
            port,
            pool,
            logging: (message) => {
                logger.info(message);
            }
        }
    );

    sequelizeInstance = sequelize;

    sequelize
        .authenticate()
        .then(async () => {
            /* Add extensions for calculating geo-distance */
            await sequelize.query('CREATE EXTENSION IF NOT EXISTS cube;');
            await sequelize.query('CREATE EXTENSION IF NOT EXISTS earthdistance;');
            logger.info('Connection to database has been established successfully!');
            app.set('sequelize', sequelize);

            return cb(null, sequelize);
        })
        .catch(err => {
            logger.error('Unable to connect to the database:', err);

            return cb(err);
        });
};

module.exports = {
    init,
    getInstance: () => sequelizeInstance,
};