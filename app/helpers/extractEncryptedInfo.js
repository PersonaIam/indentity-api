/**
 * Created by vladtomsa on 06/11/2018
 */
const { Base64: { decode } } = require('js-base64');

const extractUserInfo = (userInfo) => {
    const user = {
        ...userInfo,
        personaAddress: decode(userInfo.personaAddress),
        username: decode(userInfo.username),
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
        email: decode(contactInfo.email),
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

module.exports = {
    extractUserInfo,
    extractContactInfo,
};