/**
 * Created by vladtomsa on 2019-02-12
 */
const {USER_ROLES} = require('../../config/constants');
const FavoriteNotaries = require('../database/models').FavoriteNotaries;
const UserRole = require('../database/models').UserRole;
const usersController = require('./users');

const list = (params) => {
    return FavoriteNotaries
        .findAll({
            where: {...params},
        });
};

const create = async (userId, notaryId) => {
    const notaryInfo = await usersController.findById(notaryId);

    if (!notaryInfo.dataValues) {
        throw new Error('INVALID_NOTARY');
    }

    const userRoleInfo = await UserRole.findById(notaryInfo.dataValues.userRoleId);

    if (userRoleInfo.name !== USER_ROLES.NOTARY) {
        throw new Error('SPECIFIED_USER_IS_NOT_A_NOTARY');
    }

    return await FavoriteNotaries.findOrCreate({ where: { userId, notaryId } });
};

const getUsersFavorites = (userId) => {
  return list({ userId });
};

const remove = async (userId, id) => {
    const favNotaryInfo = await FavoriteNotaries.findById(id);

    if (!favNotaryInfo) {
        throw new Error('CANNOT_FIND_FAVORITE_NOTARY_INFO');
    }

    if (favNotaryInfo.userId !== userId) {
        throw new Error('INVALID_USER_PERFORMING_THIS_OPERATION');
    }

    return await FavoriteNotaries.destroy({ where: { id: id } })
        .then(() => {
            return { success: true };
        });
};

module.exports = {
    create,
    getUsersFavorites,
    remove,
};