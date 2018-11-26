/**
 * Created by vladtomsa on 22/11/2018
 */

const usersController = require('./users');
const {USER_ROLES} = require('../../config/constants');

const list = (params) => {
    return usersController.list({ ...params, userRoleInfo: { name: USER_ROLES.PROVIDER } });
};

const create = async(req) => {
    return usersController.create(req);
};

module.exports = {
    create,
    list,
};