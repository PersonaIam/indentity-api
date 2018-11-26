/**
 * Created by vladtomsa on 27/09/2018
 */
const async = require('async');
const cron = require('node-cron');
const express = require('express');

const ENV = process.env.NODE_ENV || 'development';
const config = require('../config')[ENV];
const PORT = process.env.PORT || config.api.port;
const serverModulesConfigs = require('./config');
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
        if (error) console.log(error);
        else {
            app.listen(PORT, () => {
                console.info('***************************************************');
                console.info('Server started on http://localhost:%s', PORT);
                console.info('***************************************************');
            });
        }
    }
);

