/**
 * Created by vladtomsa on 08/11/2018
 */
const ContactInfo = require('../database/models').ContactInfo;
const Countries = require('../database/models').Countries;
const { extractContactInfo } = require('../helpers/extractEncryptedInfo');

const list = (params) => {
    return ContactInfo
        .findAll({
            where: {...params},
            include: [
                {
                    model: Countries,
                    as: 'country',
                },
            ]
        })
        .then((contactInfoList) => {
            return contactInfoList.map((contact) => {
                return extractContactInfo(contact.dataValues);
            });
        });
};

const update = (contactInfo, id) => {
    return ContactInfo.update(contactInfo, {where: {id: id}, individualHooks: true});;
};


module.exports = {
    list,
    update,
};