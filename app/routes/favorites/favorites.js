/**
 * Created by vladtomsa on 2019-02-12
 */
const express = require('express');
const countriesController = require('../../controllers').favoritesController;

const router = express.Router();
const path = "/countries";

router
    .route('/')
    .get((req, res, next) => {
        countriesController.list()
            .then(data => res.status(200).send(data))
            .catch(next);
    });

module.exports = {
    router,
    path,
};