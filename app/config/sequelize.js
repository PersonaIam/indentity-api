/**
 * Created by vladtomsa on 27/09/2018
 */
const Sequelize = require('sequelize');

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

    const sequelizeOptions = {
        operatorsAliases: false,
        host,
        dialect,
        port,
        pool,
    };

    const sequelize = new Sequelize(
        database,
        username,
        password,
        sequelizeOptions
    );

    sequelize
        .authenticate()
        .then(async () => {
            /* Add extensions for calculating geo-distance */
            await sequelize.query('CREATE EXTENSION IF NOT EXISTS cube;');
            await sequelize.query('CREATE EXTENSION IF NOT EXISTS earthdistance;');

            console.log('Connection to database has been established successfully!');
            app.set('sequelize', sequelize);

            sequelizeInstance = sequelize;

            return cb(null, sequelize);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);

            return cb(err);
        });
};

module.exports = {
    init,
    getInstance: () => sequelizeInstance,
};