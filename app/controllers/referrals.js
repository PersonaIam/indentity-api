/**
 * Created by vladtomsa on 2019-02-04
 */
const Invitations = require('../database/models').Invitations;
const Referrals = require('../database/models').Referrals;
const User = require('../database/models').User;
const {extractUserInfo} = require('../helpers/extractEncryptedInfo');
const uuidv1 = require('uuid/v1');

const create = async (req) => {
    try {
        const {userId, referralCode} = req.body;
        const referralInfo = await Referrals.create({
            userId,
            referralCode,
        });

        return referralInfo;
    } catch (error) {
        throw error;
    }
};

const createInvitation = (req) => {
    const { userId, referralId } = req.body;

    return Invitations.create({ userId, referralId });
};

const confirmInvitation = async (req) => {
    const { userId } = req.body;

    return Invitations.update({ isActive: true }, {where: {userId}});
};

const generate = async (userId) => {
    try {
        const isReferralExisting = await list({userId});

        if (!isReferralExisting[0]) {
            const referralCode = uuidv1();

            const createInfo = {
                body: {
                    userId,
                    referralCode,
                },
            };

            await create(createInfo);
        }
    } catch (error) {
        throw error;
    }
};

const list = (params) => {
    return Referrals.findAll({
        where: {...params},
        include: [
            {
                model: Invitations,
                as: 'invitations',
                include: [
                    {
                        model: User,
                        as: 'userInfo',
                        attributes: ['personaAddress'],
                    },
                ]
            },
        ]
    })
        .then((result) => {
            return result.map(referral => {
                return {
                    ...referral.dataValues,
                    invitations: referral.invitations.map((invitation) => {
                        return {
                            ...invitation.dataValues,
                            personaAddress: invitation.userInfo ? extractUserInfo(invitation.userInfo).personaAddress : null,
                        };
                    })
                }
            });
        });
};

const generateReferralsForExistingUsers = async () => {
    const existingUsers = await User.findAll({
        include: [{
            model: Referrals,
            as: 'referralInfo',
        }]
    })
        .then((availableUsers) => {
            return availableUsers.filter((u) => !u.referralInfo);
        });

    if (existingUsers && existingUsers.length) {
        for (let i = 0; i < existingUsers.length; i++) {
            const userId = existingUsers[i].id;

            await generate(userId);
        }
    }
};

module.exports = {
    createInvitation,
    confirmInvitation,
    generate,
    generateReferralsForExistingUsers,
    list,
};