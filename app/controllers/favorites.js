/**
 * Created by vladtomsa on 2019-02-12
 */
const FavoriteNotaries = require('../database/models').FavoriteNotaries;

const list = (params) => {
    return FavoriteNotaries
        .findAll({
            where: {...params},
        });
};

const getUsersFavorites = (userId) => {
  return list({ userId });
};

module.exports = {
    getUsersFavorites,
};