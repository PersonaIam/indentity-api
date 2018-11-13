/**
 * Created by vladtomsa on 05/11/2018
 */
const ContactInfo = require('../database/models').ContactInfo;
const Countries = require('../database/models').Countries;
const User = require('../database/models').User;
const UserRole = require('../database/models').UserRole;
const listUsers = require('./users').list;
const {extractUserInfo} =  require('../helpers/extractEncryptedInfo');
const {getInstance} = require('../config/sequelize');

const list = (params) => {
    return listUsers({ ...params, userRoleInfo: { name: 'NOTARY' } });
};

const listByLocation = ({ contactInfo = { }, userRoleInfo = {}, lat, lng, pageNumber = 0, pageSize = 10, ...params }) => {
    const sequelizeInstance = getInstance();

    const extractBase64Query = (column) => {
      return `convert_from(decode(${column}, 'base64'), 'UTF8')`;
    };

    const distanceQuery = `(earth_distance(ll_to_earth(${lat},${lng}), ll_to_earth(CAST(${extractBase64Query("lat")} AS FLOAT),CAST(${extractBase64Query("lng")} AS FLOAT))))`;

    return User
        .findAndCountAll({
            where: {...params},
            order: sequelizeInstance.literal('"contactInfo.distance" ASC'),
            offset: pageNumber * pageSize,
            limit: pageSize,
            attributes: {
                exclude: ['contactInfoId', 'password', 'userRoleId'],
            },
            include: [
                {
                    model: UserRole,
                    as: 'userRoleInfo',
                    where: {
                        ...userRoleInfo,
                        name: 'NOTARY',
                    }
                },
                {
                    model: ContactInfo,
                    as: 'contactInfo',
                    where: { ...contactInfo },
                    attributes: {
                        include: [[sequelizeInstance.literal(distanceQuery), 'distance']],
                    },
                    include: [
                        {
                            model: Countries,
                            as: 'country',
                        },
                    ]
                }
            ],
        })
        .then((result) => {
            return {
                count: result.count,
                userInfoList: result.rows.map((user) => {
                    return extractUserInfo(user.dataValues);
                }),
            };
        })
};

// const create = async(notaryInfo) => {
//     try {
//         const { userId, contactInfo } = notaryInfo;
//         const notary = await Notary.create();
//
//         const userInfo = await User.findById(userId);
//         const contact = await ContactInfo.create(contactInfo);
//
//         if (!userInfo) {
//             throw ('UNKNOWN_USER');
//         }
//
//         notary.setUserInfo(userInfo);
//         notary.setContactInfo(contact);
//
//         return notary;
//     } catch (error) {
//         return error;
//     }
// };
//
// const update = (userInfo, id) => {
//     return Notary.update(userInfo, {where: {id: id}, individualHooks: true});
// };

module.exports = {
    // create,
    list,
    listByLocation,
    // update,
};