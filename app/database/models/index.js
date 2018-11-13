'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../config/sequelize.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}


/**
 * In order to sync new database correctly some models need
 * to be instantiated before others
 **/
const MODEL_PRIORITY = {
    'userrole.js': 0,
    'contactinfo.js': 1,
    'countries.js': 2,
};

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .map(file => {
        return {fileName: file, priority: MODEL_PRIORITY[file] || Number.MAX_SAFE_INTEGER};
    })
    .sort((f1, f2) => {
        return parseFloat(f1.priority) - parseFloat(f2.priority)
    })
    .forEach(fileInfo => {
        const model = sequelize['import'](path.join(__dirname, fileInfo.fileName));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
