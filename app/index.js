/**
 * Created by vladtomsa on 27/09/2018
 */
const async = require('async');
const cron = require('node-cron');
const express = require('express');
const http = require('http');

const ENV = process.env.NODE_ENV || 'development';
const config = require('../config')[ENV];
const PORT = process.env.PORT || config.api.port;
const serverModulesConfigs = require('./config');
const logger = require('./config/logger');
const tasks = require('./tasks');

const app = express();

async.auto(
    {
        config: (cb) => {
            app.set('config', config);

            return cb(null);
        },

        database: ['config', (scope, cb) => {
            serverModulesConfigs.sequelize.init(app, (error) => cb(error));
            serverModulesConfigs.umzug.syncDatabase();
        }],

        email: ['config', (scope, cb) => {
            serverModulesConfigs.email.init(app, (error) => cb(error))
        }],

        express: ['database', (scope, cb) => {
            serverModulesConfigs.express.init(app, (error) => cb(error))
        }],

        tasks: ['database', (scope, cb) => {
            tasks.forEach(taskConfig => {
                const task = taskConfig(app);

                const isTaskValid = cron.validate(task.interval);

                if (isTaskValid) cron.schedule(task.interval, task.task);
            });

            cb(null);
        }]

    },
    (error) => {
        if (error) logger.error(error);
        else {
            const server = http.createServer(app);

            serverModulesConfigs.chat.init(server, () => {
                logger.info(`Websocket communication established on port: ${PORT}`);
            });

            server.listen(PORT, () => {
                logger.info(`Server started on port: ${PORT}`);
                console.info(`Server started on port: ${PORT}`); // visual indicator that server is up and running
            });
        }
    }
);

