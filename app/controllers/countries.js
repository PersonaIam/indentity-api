/**
 * Created by vladtomsa on 07/11/2018
 */
const Countries = require('../database/models').Countries;
const orderBy = require('lodash/orderBy');

const list = (params) => {
    return Countries
        .findAll({
            where: {...params},
        })
        .then((countryInfoList) => {
            return orderBy(countryInfoList, ['name']);
        })
};


module.exports = {
    list,
};