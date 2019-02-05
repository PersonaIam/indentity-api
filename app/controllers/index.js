/**
 * Created by vladtomsa on 27/09/2018
 */
const contactsController = require('./contacts');
const conversationsController = require('./conversations');
const countriesController = require('./countries');
const notariesController = require('./notaries');
const providersController = require('./providers');
const referralsController = require('./referrals');
const subscriptionController = require('./subscription');
const userController = require('./users');

module.exports = {
    contactsController,
    conversationsController,
    countriesController,
    notariesController,
    providersController,
    referralsController,
    subscriptionController,
    userController,
};