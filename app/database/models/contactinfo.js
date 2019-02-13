'use strict';
const Countries = require('./index').Countries;
const {Base64} = require('js-base64');

const encryptContactInfo = (contactInfo) => {
    const encode = Base64.encode;
    const changed = contactInfo._changed;

    if (changed.firstName) contactInfo.firstName = encode(contactInfo.firstName);

    if (changed.lastName) contactInfo.lastName = encode(contactInfo.lastName);

    if (changed.email) contactInfo.email = encode(contactInfo.email);

    if (changed.phoneNumber) contactInfo.phoneNumber = encode(contactInfo.phoneNumber);

    if (changed.address) contactInfo.address = encode(contactInfo.address);

    if (changed.city) contactInfo.city = encode(contactInfo.city);

    if (changed.zipCode) contactInfo.zipCode = encode(contactInfo.zipCode);

    /**
    * When updating location, invalidate previous geolocatiom
    * */
    if (
        changed.address
        || changed.city
        || changed.zipCode
        || changed.countryId
    ) {
        contactInfo.lng = null;
        contactInfo.lng = null;
    }
    else {
        /**
         * WARNING: lat and lng need to be encrypted in Base64 in order to calculate distances for nearest notaries
         * */
        if (changed.lat) contactInfo.lat = encode(contactInfo.lat);

        if (changed.lng) contactInfo.lng = encode(contactInfo.lng);
    }

    return contactInfo;
};

module.exports = (sequelize, DataTypes) => {
    const ContactInfo = sequelize.define('ContactInfo', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeIdentityIndex',
        },
        phoneNumber: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        lat: DataTypes.STRING,
        lng: DataTypes.STRING,
        getGeolocationError: DataTypes.STRING,
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Countries,
                key: 'id'
            }
        },
    }, {});

    ContactInfo.associate = function (models) {
        // associations can be defined here
        ContactInfo.belongsTo(models.Countries, {
            foreignKey: 'countryId',
            as: 'country',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    };

    ContactInfo.hook('beforeCreate', (contactInfo) => {
        return encryptContactInfo(contactInfo);
    });

    ContactInfo.hook('beforeUpdate', (contactInfo) => {
        return encryptContactInfo(contactInfo);
    });

    return ContactInfo;
};