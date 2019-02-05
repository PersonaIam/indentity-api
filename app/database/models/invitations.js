'use strict';
const Referrals = require('./index').Referrals;
const User = require('./index').User;

module.exports = (sequelize, DataTypes) => {
  const Invitations = sequelize.define('Invitations', {
    referralId: {
      type: DataTypes.INTEGER,
      references: {
        model: Referrals,
        key: 'id'
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      },
    },
    isActive: DataTypes.BOOLEAN
  }, {});
  Invitations.associate = function(models) {
    Invitations.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userInfo',
    });
  };
  return Invitations;
};