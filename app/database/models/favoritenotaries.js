'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteNotaries = sequelize.define('FavoriteNotaries', {
    userId: DataTypes.INTEGER,
    notaryId: DataTypes.INTEGER,
  }, {});
  FavoriteNotaries.associate = function(models) {
    FavoriteNotaries.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userInfo',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    FavoriteNotaries.belongsTo(models.User, {
      foreignKey: 'notaryId',
      as: 'notaryInfo',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };
  return FavoriteNotaries;
};