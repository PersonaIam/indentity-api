'use strict';
const User = require('./index').User;

module.exports = (sequelize, DataTypes) => {
  const Referrals = sequelize.define('Referrals', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      },
    },
    referralCode: DataTypes.STRING
  }, {});
  Referrals.associate = function(models) {
    Referrals.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userInfo',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    Referrals.hasMany(models.Invitations, {
      as: 'invitations',
      foreignKey: 'referralId',
    });
  };
  return Referrals;
};