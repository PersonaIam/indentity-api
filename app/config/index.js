/**
 * Created by vladtomsa on 27/09/2018
 */
const chat = require('./chat');
const email = require('./email');
const express = require('./express');
const umzug = require('./umzug');
const sequelize = require('./sequelize');

module.exports = {
    chat,
    email,
    express,
    sequelize,
    umzug,
};