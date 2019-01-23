/**
 * Created by vladtomsa on 22/11/2018
 */
const path = require('path');
const Sequelize = require('sequelize');
const Umzug = require('umzug');
const logger = require('../logger');
const { getInstance } = require('../sequelize');

const syncDatabase = () => {
    const sequelizeInstance = getInstance();

    const umzug = new Umzug({
        storage: 'sequelize',

        storageOptions: {
            sequelize: sequelizeInstance,
        },

        migrations: {
            params: [
                sequelizeInstance.getQueryInterface(),
                Sequelize,
            ],
            path: path.resolve(__dirname, '../../', 'database', 'migrations'),
            pattern: /\.js$/
        },
    });

    const logUmzugEvent = eventName => (name) => {
        logger.info(`${eventName} :: ${name}`);
    };

    const printStatus = () => Promise.all([umzug.executed(), umzug.pending()])
        .then(results => Object.assign({}, {
            executed: results[0].map(m => m.file),
            pending: results[1].map(m => m.file),
        }))
        .then((status) => {
            logger.info(JSON.stringify(status, null, 2));
            return status;
        });

    umzug.on('migrating', logUmzugEvent('migrating'));
    umzug.on('migrated', logUmzugEvent('migrated'));
    umzug.on('reverting', logUmzugEvent('reverting'));
    umzug.on('reverted', logUmzugEvent('reverted'));

    umzug.up().then(printStatus);
};

module.exports = {
    syncDatabase,
};
