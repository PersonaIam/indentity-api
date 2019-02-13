/**
 * Created by vladtomsa on 06/11/2018
 */
const { Base64: { decode } } = require('js-base64');

const extractUserInfo = (userInfo) => {
    const user = {
        ...userInfo,
        personaAddress: userInfo.personaAddress ? decode(userInfo.personaAddress) : null,
        username: userInfo.username ? decode(userInfo.username) : null,
    };

    if (userInfo.contactInfo) {
        const contact = userInfo.contactInfo.dataValues || userInfo.contactInfo;
        user.contactInfo = extractContactInfo(contact);
    }

    return user;
};

const extractContactInfo = (contactInfo) => {
    const contact = {
        ...contactInfo,
        email: contactInfo.email ? decode(contactInfo.email) : null,
    };

    if (contactInfo.firstName) contact.firstName = decode(contactInfo.firstName);

    if (contactInfo.lastName) contact.lastName = decode(contactInfo.lastName);

    if (contactInfo.phoneNumber) contact.phoneNumber = decode(contactInfo.phoneNumber);

    if (contactInfo.address) contact.address = decode(contactInfo.address);

    if (contactInfo.city) contact.city = decode(contactInfo.city);

    if (contactInfo.zipCode) contact.zipCode = decode(contactInfo.zipCode);

    if (contactInfo.lat) contact.lat = decode(contactInfo.lat);

    if (contactInfo.lng) contact.lng = decode(contactInfo.lng);

    return contact;
};

const extractSubscriptionInfoInfo = (subscriptionInfo) => {
    const subscription = {
        ...subscriptionInfo,
        firstName: decode(subscriptionInfo.firstName),
        lastName: decode(subscriptionInfo.lastName),
        email: decode(subscriptionInfo.email),
    };

    return subscription;
};

module.exports = {
    extractUserInfo,
    extractContactInfo,
    extractSubscriptionInfoInfo,
};