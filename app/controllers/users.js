/**
 * Created by vladtomsa on 27/09/2018
 */
const jwt = require('jsonwebtoken');
const axios = require('axios');
const {Base64: {encode}} = require('js-base64');
const referralsController = require('./referrals');
const logger = require('../config/logger');
const ContactInfo = require('../database/models').ContactInfo;
const Countries = require('../database/models').Countries;
const User = require('../database/models').User;
const UserRole = require('../database/models').UserRole;
const {REGISTRATION_LINK_JWT_KEY, REGISTRATION_LINK_EXPIRES_IN_HOURS, USER_ROLES, CREDIT_SERVER} = require('../../config/constants');
const {extractUserInfo} = require('../helpers/extractEncryptedInfo');
const moment = require('moment');

const isAllowed = async (req) => {
    const {body: {userRoleId}, userInfo} = req;

    const userRoles = await UserRole.findAll();

    let providerInfo = null, sysAdminInfo = null;

    userRoles.forEach((role) => {
        if (role.name === USER_ROLES.PROVIDER) providerInfo = role;
        if (role.name === USER_ROLES.SYS_ADMIN) sysAdminInfo = role;
    });

    const isSysAdminPerformingAction = () => {
        return userInfo && userInfo.userRoleId === sysAdminInfo.id;
    };

    /**
     * Providers can be created only by sys admin's
     * */
    if (
        userRoleId === providerInfo.id
        && !isSysAdminPerformingAction()
    ) {
        throw ('UNAUTHORIZED: Only administrators can create providers');
    }

    /**
     * Providers can be created only by sys admin's
     * */
    if (
        userRoleId === sysAdminInfo.id
        && !isSysAdminPerformingAction()
    ) {
        throw ('UNAUTHORIZED: Only administrators can create administrators');
    }
};

const setUserContactInfo = async (userInfo, contactInfo) => {
    let contact;

    if (userInfo.contactInfoId) {
        const updatedContactInfoResultResult = await ContactInfo.update(contactInfo, {
            where: {id: userInfo.contactInfoId},
            individualHooks: true,
        });

        contact = updatedContactInfoResultResult[1][0];
    }
    else {
        contact = await ContactInfo.create(contactInfo);
    }

    await userInfo.setContactInfo(contact);

    return userInfo;
};

const findById = (id) => {
    return User.findById(id)
        .then((result) => {
            return result ? extractUserInfo(result) : null;
        });
};

const list = ({contactInfo = {}, userRoleInfo = {}, pageNumber = 0, pageSize = 10, ...params}) => {
    return User
        .findAndCountAll({
            where: {...params},
            attributes: {
                exclude: ['contactInfoId', 'password', 'socketId'],
            },
            offset: pageNumber * pageSize,
            limit: pageSize,
            include: [
                {
                    model: UserRole,
                    as: 'userRoleInfo',
                    where: {...userRoleInfo}
                },
                {
                    model: ContactInfo,
                    as: 'contactInfo',
                    where: {...contactInfo},
                    include: [
                        {
                            model: Countries,
                            as: 'country',
                        },
                    ]
                }
            ]
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

const create = async (req) => {
    try {
        await isAllowed(req);

        const {username, userRoleId, email, contactInfo, referralCode} = req.body;
        let referralInfo;

        if (referralCode) {
            const referralInfoList = await referralsController.list({ referralCode });
            referralInfo = referralInfoList[0];

            if (!referralInfo) {
                throw new Error('Invalid invitation link. Please create your account using the register page');
            }
        }

        const userInfo = await User.create({username, userRoleId, email});

        if (contactInfo) {
            await setUserContactInfo(userInfo, contactInfo);
        }

        if (referralInfo) {
            const invitationInfo = {
                body: {
                    userId: userInfo.id,
                    referralId: referralInfo.id,
                },
            };

            await referralsController.createInvitation(invitationInfo);
        }

        return userInfo;
    } catch (error) {
        throw error;
    }
};

const update = async (userInfo, id) => {
    try {
        // public static update(values: Object, options: Object): Promise<Array<affectedCount, affectedRows>>
        const updatedUserResult = await User.update(userInfo, {where: {id: id}, individualHooks: true});
        const updatedUser = updatedUserResult[1][0];
        if (userInfo.contactInfo) {
            await setUserContactInfo(updatedUser, {
                ...userInfo.contactInfo,
                lat: null,
                lng: null,
            });
        }

        return await User.find({
            where: { id },
            attributes: {
                exclude: ['contactInfoId', 'password', 'socketId'],
            },
            include: [
                {
                    model: UserRole,
                    as: 'userRoleInfo',
                },
                {
                    model: ContactInfo,
                    as: 'contactInfo',
                    include: [
                        {
                            model: Countries,
                            as: 'country',
                        },
                    ]
                }
            ]
        })
            .then((user) => {
                return extractUserInfo(user.dataValues);
            });
    } catch (error) {
        throw error;
    }
};

const confirmUser = ({address, password, token}) => {
    return new Promise((resolve, reject) => {
        try {
            // Most frequently, if the token has expired JWT will throw an TokenExpiredError here
            const {username, email} = jwt.verify(token, REGISTRATION_LINK_JWT_KEY);

            const verifyUserParams = {
                // ToDo see if where supports nesting
                contactInfo: {
                    email: encode(email),
                },
                username: encode(username),
            };

            list(verifyUserParams)
                .then(({userInfoList}) => {
                    if (userInfoList && userInfoList.length) {
                        const userInfo = userInfoList[0];

                        if (userInfo.isActive || userInfo.password) {
                            return reject({message: 'User already confirmed'});
                        }

                        const toUpdate = {
                            password,
                            isActive: true,
                            personaAddress: address,
                        };

                        update(toUpdate, userInfo.id)
                            .then(async () => {
                                await referralsController.generate(userInfo.id);

                                await referralsController.confirmInvitation({
                                    body: {
                                        userId: userInfo.id,
                                    },
                                });

                                axios.post(
                                    `${CREDIT_SERVER.HOST}:${CREDIT_SERVER.PORT}${CREDIT_SERVER.PATH}`,
                                    {
                                        address,
                                    }
                                )
                                    .then(() => {
                                        logger.info(`CREDITED ADDRESS: ${address}`);
                                    })
                                    .catch(e => {
                                        logger.error(`CANNOT CREDIT ADDRESS: ${address}`);
                                        logger.error(e);
                                    });

                                resolve({
                                    username
                                });
                            })
                            .catch(reject)
                    }
                    else {
                        return reject({message: 'Invalid user'});
                    }
                })
                .catch((error) => reject(error));
        }
        catch (error) {
            return reject(error);
        }
    })
};

const getNewUsers = () => {
    const params = {
        isRegEmailSent: null,
    };

    return list(params);
};

const getCurrentUserBySocketId = async (socketId) => {
    let user;
    const { count, userInfoList } = await list({ socketId });

    if (count) {
        user = userInfoList[0];
    }

    return user;
};

const getUserByPersonaAddress = async  (personaAddress) => {
    return User.find({
        where: {
            personaAddress: encode(personaAddress)
        }
    });
};

const removeUnconfirmedUsers = async () => {
    const registrationExpirationDate = moment().add(-1 * REGISTRATION_LINK_EXPIRES_IN_HOURS, 'hours');

    const unconfrimedParams = {
        isActive: null,
        isRegEmailSent: true,
        updatedAt: {
          $lte: registrationExpirationDate.toDate(),
        },
    };

    const {
        count, userInfoList
    } = await list(unconfrimedParams);

    if (count) {
        for (let i = 0; i < userInfoList.length; i++) {
            const { id, contactInfo } = userInfoList[i];

            logger.info('Removing users with id: ' + id);

            await User.destroy({ where: { id: id } });

            await ContactInfo.destroy({ where: { id: contactInfo.id } });
        }
    }

    return {
        count,
    };
};

module.exports = {
    confirmUser,
    create,
    findById,
    getNewUsers,
    getCurrentUserBySocketId,
    getUserByPersonaAddress,
    list,
    removeUnconfirmedUsers,
    update,
};