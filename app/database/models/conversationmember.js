'use strict';
const Conversation = require('./index').Conversation;

module.exports = (sequelize, DataTypes) => {
    const ConversationMember = sequelize.define('ConversationMember', {
        personaAddress: DataTypes.STRING,
        lastSeenOn: DataTypes.DATE,
        conversationId: {
            type: DataTypes.INTEGER,
            references: {
                model: Conversation,
                key: 'id'
            },
        },
    }, {});
    ConversationMember.associate = function (models) {
        ConversationMember.belongsTo(models.Conversation, {
            foreignKey: 'conversationId',
            as: 'conversationInfo',
        });
    };
    return ConversationMember;
};