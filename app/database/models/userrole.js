'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    name: DataTypes.STRING
  }, {});

  UserRole.associate = function(models) {
      UserRole.hasMany(models.User, {
          as: 'usersInfoList',
          foreignKey: 'userRoleId',
      })
  };

  UserRole.sync()
      .then(async () => {
        try {
          const now = sequelize.fn('now');

          await UserRole.findOrCreate({ where: { name: 'IDENTITY_USER' }, defaults: { name: 'IDENTITY_USER', createdAt: now }});
          await UserRole.findOrCreate({ where: { name: 'NOTARY' }, defaults: { name: 'NOTARY', createdAt: now }});
          await UserRole.findOrCreate({ where: { name: 'SYS_ADMIN' }, defaults: { name: 'SYS_ADMIN', createdAt: now }});
        }
        catch(error) {
            console.log('error creating user roles');
            console.log(error);
        }
      })
      .catch((error) => console.log('Error creating user roles table: ', error));


    return UserRole;
};