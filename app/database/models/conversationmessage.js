'use strict';
module.exports = (sequelize, DataTypes) => {
  const ConversationMessage = sequelize.define('ConversationMessage', {
    message: DataTypes.STRING
  }, {});
  ConversationMessage.associate = function(models) {
      ConversationMessage.belongsTo(models.Conversation, {
          foreignKey: 'conversationId',
          as: 'conversationInfo',
      });

      ConversationMessage.belongsTo(models.ConversationMember, {
          foreignKey: 'conversationMemberId',
          as: 'conversationMemberInfo',
      });
  };
  return ConversationMessage;
};