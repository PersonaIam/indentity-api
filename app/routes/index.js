/**
 * Created by vladtomsa on 27/09/2018
 */
const countries = require('./countries/countries');
const favorites = require('./favorites/favorites');
const notaries = require('./notaries/notaries');
const providers = require('./providers/providers');
const referrals = require('./referrals/referrals');
const subscription = require('./subscription/subscription');
const users = require('./users/users');

module.exports = [
    countries,
    favorites,
    notaries,
    providers,
    referrals,
    subscription,
    users,
];