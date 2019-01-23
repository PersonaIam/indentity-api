'use strict';
module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    }, {});

    Conversation.associate = function (models) {
        Conversation.hasMany(models.ConversationMember, {
            as: 'conversationMembers',
            foreignKey: 'conversationId',
        });
        Conversation.hasMany(models.ConversationMessage, {
            as: 'conversationMessages',
            foreignKey: 'conversationId',
        });
        // associations can be defined here
    };
    return Conversation;
};