/**
 * Created by vladtomsa on 16/01/2019
 */
const Conversation = require('../database/models').Conversation;
const ConversationMember = require('../database/models').ConversationMember;
const ConversationMessage = require('../database/models').ConversationMessage;
const logger = require('../config/logger');
const Op = require('sequelize').Op;
const orderBy = require('lodash/orderBy');
const moment = require('moment');

const generateConversationName = (members = []) => {
    return orderBy(members, (m) => m.toLowerCase()).join('-');
};

const create = async (data) => {
    try {
        const {members = [], author, message} = data;
        let conversation;

        if (members && members.length) {
            const conversationName = generateConversationName(members);
            const conversationMessage = {
                message,
                conversationId: null,
                conversationMemberId: null,
            };

            conversation = await Conversation.create({ name: conversationName });
            const conversationId = conversation.id;

            const conversationMembers = [];

            for (let personaAddress of members) {
                const memberInfo = await ConversationMember.create({
                    personaAddress,
                    conversationId,
                });

                if (personaAddress === author) {
                    conversationMessage.conversationId = conversationId;
                    conversationMessage.conversationMemberId = memberInfo.id;

                    const messageInfo = await ConversationMessage.create(conversationMessage);

                    conversation.dataValues.conversationMessages = [messageInfo];
                }

                conversationMembers.push(memberInfo);
            }

            conversation.dataValues.conversationMembers = conversationMembers;
        }

        return conversation;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

/**
 * Creates a new message and updates the conversation's updatedAt time
 * @param author {string} - author's personaAddress
 * @param conversationId {number}
 * @param message {string}
 * */
const createMessage = async (author, conversationId, message) => {
    let conversationInfo, messageInfo;

    try {
        conversationInfo = await Conversation.findById(conversationId, {
            include: [
                {
                    model: ConversationMember,
                    as: 'conversationMembers',
                },
            ]
        });

        const authorInfo = conversationInfo.conversationMembers.find(m => m.personaAddress === author);

        const conversationMessage = {
            message,
            conversationId,
            conversationMemberId: authorInfo.id,
        };

        messageInfo = await ConversationMessage.create(conversationMessage);

        await Conversation.update({
            updatedAt: new Date(),
        }, {
            where: {id: conversationId},
        });

        await ConversationMember.update({
            lastSeenOn: new Date(),
        }, {
            where: {id: authorInfo.id},
        });

        return {
            conversationInfo,
            messageInfo,
        };
    }
    catch (e) {
        logger.error(e);
        return {
            conversationInfo,
            messageInfo,
        };
    }
};

const findByMembers = async (members) => {
    const conversationName = generateConversationName(members);

    return await list({name: conversationName});
};

const getUserConversationsByPersonaAddress = async (personaAddress) => {
    return await ConversationMember
        .findAll({
            where: {
                personaAddress,
            },
        })
        .then(async (userMembers) => {
            const usersConversationsIds = userMembers.map(member => member.conversationId);

            return await Conversation
                .findAll({
                    where: {
                        id: {
                            [Op.or]: usersConversationsIds
                        }
                    },
                    include: [
                        {
                            model: ConversationMember,
                            as: 'conversationMembers',
                        },
                    ],
                })
                .then((conversations) => {
                    return conversations.map((conversation) => {
                        const currentUserConversationMember = conversation.conversationMembers.find(m => m.personaAddress === personaAddress);

                        const conversationLastUpdate = moment(conversation.updatedAt);
                        const userLastSeen = moment(currentUserConversationMember.lastSeenOn);

                        // ToDo check this condition
                        // whether or not the current user has unread messages here
                        conversation.setDataValue('notifications', moment(userLastSeen).diff(moment(conversationLastUpdate)) < 100);

                        return conversation;
                    });
                });
        });
};

const list = (params) => {
    return Conversation
        .findAll({
            where: {...params},
            include: [
                {
                    model: ConversationMember,
                    as: 'conversationMembers',
                },
                {
                    model: ConversationMessage,
                    as: 'conversationMessages',
                },
            ]
        });
};

const updateLastSeenOn = async (conversationId, personaAddress) => {
  return await ConversationMember.update({
        lastSeenOn: new Date(),
    }, {
        where: {
            conversationId,
            personaAddress,
        },
    });
};

module.exports = {
    create,
    createMessage,
    findByMembers,
    getUserConversationsByPersonaAddress,
    updateLastSeenOn,
};
