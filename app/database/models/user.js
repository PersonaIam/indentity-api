'use strict';
const UserRole = require('./index').UserRole;
const ContactInfo = require('./index').ContactInfo;
const {Base64} = require('js-base64');

const encryptUserInfo = (userInfo) => {
    const encode = Base64.encode;
    const changed = userInfo._changed;

    if (changed.username) userInfo.username = encode(userInfo.username);

    if (changed.personaAddress) userInfo.personaAddress = encode(userInfo.personaAddress);

    if (changed.password) userInfo.password = encode(userInfo.password);

    return userInfo;
};

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // Creating two objects with the same value will throw an error. The unique property can be either a
        // boolean, or a string. If you provide the same string for multiple columns, they will form a
        // composite unique key.
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        personaAddress: DataTypes.STRING,
        password: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        isRegEmailSent: DataTypes.BOOLEAN,
        userRoleId: {
            type: DataTypes.INTEGER,
            // allowNull: false,
            // defaultValue: 1,
            references: {
                model: UserRole,
                key: 'id'
            },
        },
        contactInfoId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ContactInfo,
                key: 'id'
            }
        },
        socketId: DataTypes.STRING,
    }, {});

    User.associate = function (models) {
        User.belongsTo(models.UserRole, {
            foreignKey: 'userRoleId',
            as: 'userRoleInfo',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        User.belongsTo(models.ContactInfo, {
            foreignKey: 'contactInfoId',
            as: 'contactInfo',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
        User.hasOne(models.Referrals, {
            as: 'referralInfo',
            foreignKey: 'userId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    };

    User.hook('beforeCreate', (user, options) => {
        return encryptUserInfo(user);
    });

    User.hook('beforeUpdate', (user, options) => {
        return encryptUserInfo(user);
    });

    return User;
};