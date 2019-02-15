/**
 * Created by vladtomsa on 2019-02-12
 */
const {USER_ROLES} = require('../../config/constants');
const {extractUserInfo} =  require('../helpers/extractEncryptedInfo');
const FavoriteNotaries = require('../database/models').FavoriteNotaries;
const ContactInfo = require('../database/models').ContactInfo;
const Countries = require('../database/models').Countries;
const User = require('../database/models').User;
const UserRole = require('../database/models').UserRole;
const usersController = require('./users');

const list = (params) => {
    return FavoriteNotaries
        .findAll({
            where: {...params},
            include: [
                {
                    model: User,
                    as: 'notaryInfo',
                    attributes: {
                        exclude: ['contactInfoId', 'isRegEmailSent', 'isActive','password', 'userRoleId', 'socketId'],
                    },
                    include: [
                        {
                            model: ContactInfo,
                            as: 'contactInfo',
                            attributes: {
                                exclude: ['address', 'email', 'getGeolocationError', 'id', 'lat', 'lng', 'phoneNumber', 'zipCode'],
                            },
                            include: [
                                {
                                    model: Countries,
                                    as: 'country',
                                },
                            ],
                        },
                        {
                            model: UserRole,
                            as: 'userRoleInfo',
                            where: {
                                $or: [
                                    {
                                        name: USER_ROLES.NOTARY
                                    },
                                    {
                                        name: USER_ROLES.PROVIDER
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        })
        .then((results) => {
            return results.map((favInfo) => {
                return {
                    ...favInfo.dataValues,
                    notaryInfo: extractUserInfo(favInfo.notaryInfo.dataValues),
                };
            });
        });
};

const create = async (userId, notaryId) => {
    const notaryInfo = await usersController.findById(notaryId);

    if (!notaryInfo.dataValues) {
        throw new Error('INVALID_NOTARY');
    }

    const userRoleInfo = await UserRole.findById(notaryInfo.dataValues.userRoleId);

    if (!(userRoleInfo.name === USER_ROLES.NOTARY || userRoleInfo.name === USER_ROLES.PROVIDER)) {
        throw new Error('SPECIFIED_USER_IS_NOT_A_NOTARY');
    }

    return await FavoriteNotaries.findOrCreate({ where: { userId, notaryId } });
};

const getUsersFavorites = (userId) => {
  return list({ userId });
};

const remove = async (userId, id) => {
    const favNotaryInfo = await FavoriteNotaries.findById(id);

    if (!favNotaryInfo) {
        throw new Error('CANNOT_FIND_FAVORITE_NOTARY_INFO');
    }

    if (favNotaryInfo.userId !== userId) {
        throw new Error('INVALID_USER_PERFORMING_THIS_OPERATION');
    }

    return await FavoriteNotaries.destroy({ where: { id: id } })
        .then(() => {
            return { success: true };
        });
};

module.exports = {
    create,
    getUsersFavorites,
    remove,
};