/**
 * Created by vladtomsa on 15/01/2019
 */
const logger = require('../../config/logger');
const conversationsController = require('../../controllers').conversationsController;
const usersController = require('../../controllers').userController;
const { SOCKET_EVENTS } = require('../../../config/constants');

/**
 * Helper method to send specific events to clients (toSendPersonaAddresses)
 * @param socket {WebSocket}
 * @param toSendPersonaAddresses {String[]}
 * @param eventType {String}
 * @param value {any}
 * */
const emitToPersonaAddresses = async (socket, toSendPersonaAddresses, eventType, value) => {
    for (let i = 0; i < toSendPersonaAddresses.length; i++) {
        const personaAddress = toSendPersonaAddresses[i];
        const userInfo = await usersController.getUserByPersonaAddress(personaAddress);
        const socketId = userInfo.socketId;

        if (socketId) {
            socket.to(socketId).emit(eventType, value);
        }
    }
};

const sendMessage = async (conversationId, message, user, client) => {
    const usersPersonaAddress = user.personaAddress;

    try {
        const {
            conversationInfo,
            messageInfo,
        } = await conversationsController.createMessage(
            usersPersonaAddress,
            conversationId,
            message,
        );

        if (messageInfo) {
            const toEmitMembers = conversationInfo.conversationMembers
                .filter(m => m.personaAddress !== usersPersonaAddress)
                .map(m => m.personaAddress);

            await emitToPersonaAddresses(client, toEmitMembers, SOCKET_EVENTS.MESSAGE_SENT, messageInfo);

            client.emit(SOCKET_EVENTS.MESSAGE_SENT, messageInfo);
        }
    }
    catch (e) {
        logger.error(e);
        client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_SEND_MESSAGE');
    }
};

module.exports = (client) => {
    /**
     * Register a connected socket to the Persona Chat.
     * Registering a user to the Persona Chat means assigning a socketId to that user.
     *
     * @param userInfo {Object} the user that will be registered: { id, personaAddress }
     * @param callback {function} function that will be executed with:
     *        - the registered user's id and personaAddress on success
     *        - null in case of invalid data
     * */
    client.on(
        SOCKET_EVENTS.REGISTER,
        async (userInfo = {}, callback) => {
            if (
                userInfo
                && userInfo.id
                && callback
                && typeof callback === 'function'
            ) {
                let userChatInfo;

                try {
                    const {id} = userInfo;
                    const user = await usersController.findById(id);

                    if (user && user.dataValues) {
                        await usersController.update({socketId: client.id}, id);

                        userChatInfo = {
                            id: user.dataValues.id,
                            personaAddress: user.personaAddress,
                        };
                    }
                    else {
                        logger.error(`TRIED TO REGISTER TO CHAT WITH: ${JSON.stringify(userInfo)}`);
                        client.emit(SOCKET_EVENTS.ERROR, 'INVALID_CREDENTIALS');
                    }
                }
                catch (e) {
                    logger.error(`TRIED TO REGISTER TO CHAT WITH: ${JSON.stringify(userInfo)}`);
                    logger.error(e);
                    client.emit(SOCKET_EVENTS.ERROR, 'INVALID_CREDENTIALS');
                }

                callback(userChatInfo);
            }
            else {
                client.emit(SOCKET_EVENTS.ERROR, 'INVALID_REGISTRATION_DETAILS');
            }
        },
    );

    /**
     * Logout client - removing the socket from the assigned user
     * */
    client.on(
        SOCKET_EVENTS.LOGOUT,
        async () => {
            const user = await usersController.getCurrentUserBySocketId(client.id);

            if (user) {
                await usersController.update({socketId: null}, user.id);
            }
            else {
                logger.error(`FAILED TO REMOVE ${client.id} socket`);
                client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_LOG_OUT_OF_CHAT');
            }
        },
    );


    /**
     * Disconnect client - removing the socket from the assigned user
     * */
    client.on(
        SOCKET_EVENTS.DISCONNECT,
        async () => {
            const user = await usersController.getCurrentUserBySocketId(client.id);

            if (user) {
                await usersController.update({socketId: null}, user.id);
            }
            else {
                logger.error(`FAILED TO REMOVE ${client.id} socket`);
                client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_LOG_OUT_OF_CHAT');
            }
        },
    );

    /**
     * Creates a conversation between the current client and all members send
     * @param members {String[]} - list of member identifiers (Persona Addresses) who are in the conversation, excluding the current client
     * @param message {String} - required
     * */
    client.on(
        SOCKET_EVENTS.CREATE_CONVERSATION,
        async ({members, message}) => {
            if (
                members
                && members.length
                && message
                && message.length
            ) {
                const user = await usersController.getCurrentUserBySocketId(client.id);

                if (user) {
                    const usersPersonaAddress = user.personaAddress;

                    const conversations = await conversationsController.findByMembers([...members, usersPersonaAddress]);

                    if (conversations[0]) {
                        // A conversation with these members allready exists
                        // Send this message to all members
                        const conversationId = conversations[0].id;

                        await sendMessage(conversationId, message, user, client);
                    }
                    else {
                        const conversation = await conversationsController.create({
                            members: [...members, usersPersonaAddress],
                            message,
                            author: usersPersonaAddress,
                        });

                        if (conversation) {
                            client.emit(SOCKET_EVENTS.CONVERSATION_CREATED, conversation);

                            await emitToPersonaAddresses(client, members, SOCKET_EVENTS.CONVERSATION_CREATED, {
                                ...conversation.dataValues,
                                notifications: true,
                            });
                        }
                    }
                }
                else {
                    logger.error(`FAILED TO CREATE CONVERSATION: ${client.id} is not registered as a valid user`);
                    client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_CREATE_CONVERSATION');
                }
            }
            else {
                client.emit(SOCKET_EVENTS.ERROR, 'INVALID_CONVERSATION_DETAILS');
            }
        },
    );

    /**
     * Finds a conversation between the current client and all members specified
     * @param members {String[]} - list of member identifiers (Persona Addresses) who are in the conversation, excluding the current client
     * @param callback {function} a function that will be called with the found conversation
     * */
    client.on(
        SOCKET_EVENTS.GET_CONVERSATION,
        async (members, callback) => {
            if (
                members
                && members.length
                && callback
                && typeof callback === 'function'
            ) {
                const user = await usersController.getCurrentUserBySocketId(client.id);

                if (user) {
                    const usersPersonaAddress = user.personaAddress;

                    const conversations = await conversationsController.findByMembers([...members, usersPersonaAddress]);

                    const conversation = conversations[0];

                    callback(conversation);
                }
                else {
                    logger.error(`FAILED TO GET CONVERSATION: ${client.id} is not registered as a valid user`);
                    client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_GET_CONVERSATION');
                    callback(null);
                }
            }
            else {
                client.emit(SOCKET_EVENTS.ERROR, 'INVALID_SEARCH_DETAILS');
            }
        },
    );

    /**
     * Finds all conversations for the connected user
     * @param members {String[]} - list of member identifiers (Persona Addresses) who are in the conversation, excluding the current client
     * @param callback {function} a function that will be called with the found conversation
     * */
    client.on(
        SOCKET_EVENTS.GET_USERS_CONVERSATIONS,
        async (callback) => {
            if (
                callback
                && typeof callback === 'function'
            ) {
                const user = await usersController.getCurrentUserBySocketId(client.id);

                if (user) {
                    const usersPersonaAddress = user.personaAddress;

                    const conversations = await conversationsController.getUserConversationsByPersonaAddress(usersPersonaAddress);

                    callback(conversations);
                }
                else {
                    logger.error(`FAILED TO GET CONVERSATIONS: ${client.id} is not registered as a valid user`);
                    client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_GET_CONVERSATIONS');
                    callback(null);
                }
            }
            else {
                client.emit(SOCKET_EVENTS.ERROR, 'INVALID_SEARCH_DETAILS');
            }
        },
    );

    client.on(
        SOCKET_EVENTS.SEND_MESSAGE,
        async ({conversationId, message}) => {
            if (
                conversationId
                && message
                && message.length
            ) {
                const user = await usersController.getCurrentUserBySocketId(client.id);

                if (user) {
                    await sendMessage(conversationId, message, user, client);
                }
                else {
                    logger.error(`FAILED TO SEND MESSAGE: ${client.id} is not registered as a valid user`);
                    client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_SEND_MESSAGE');
                }
            }
            else {
                client.emit(SOCKET_EVENTS.ERROR, 'INVALID_MESSAGE_DETAILS');
            }
        },
    );

    client.on(
        SOCKET_EVENTS.UPDATE_LAST_SEEN_ON,
        async (conversationId) => {
            const user = await usersController.getCurrentUserBySocketId(client.id);

            if (user) {
                const usersPersonaAddress = user.personaAddress;

                await conversationsController.updateLastSeenOn(conversationId, usersPersonaAddress);
            }
            else {
                logger.error(`FAILED TO SEND MESSAGE: ${client.id} is not registered as a valid user`);
                client.emit(SOCKET_EVENTS.ERROR, 'FAILED_TO_SEND_MESSAGE');
            }
        },
    );
};