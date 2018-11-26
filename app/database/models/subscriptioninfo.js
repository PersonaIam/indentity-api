'use strict';
const {Base64} = require('js-base64');

const encryptSubscriptionInfo = (subscriptionInfo) => {
    const encode = Base64.encode;
    const changed = subscriptionInfo._changed;

    if (changed.email) subscriptionInfo.email = encode(subscriptionInfo.email);

    if (changed.firstName) subscriptionInfo.firstName = encode(subscriptionInfo.firstName);

    if (changed.lastName) subscriptionInfo.lastName = encode(subscriptionInfo.lastName);

    return subscriptionInfo;
};

module.exports = (sequelize, DataTypes) => {
    const Subscriptions = sequelize.define('Subscriptions', {
        email: {type: DataTypes.STRING, unique: 'compositeIdentityIndex'},
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        isSubscriptionEmailSent: DataTypes.BOOLEAN,
    }, {});


    Subscriptions.hook('beforeCreate', (subscription, options) => {
        return encryptSubscriptionInfo(subscription);
    });

    Subscriptions.hook('beforeUpdate', (subscription, options) => {
        return encryptSubscriptionInfo(subscription);
    });

    return Subscriptions;
};