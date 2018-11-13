/**
 * Created by vladtomsa on 07/11/2018
 *//**
 * Created by vladtomsa on 05/11/2018
 */
const express = require('express');
const countriesController = require('../../controllers').countriesController;

const router = express.Router();
const path = "/countries";

router
    .route('/')
    .get((req, res) => {
        countriesController.list()
            .then(data => res.status(200).send(data))
            .catch(error => res.status(400).send(error));
    });

module.exports = {
    router,
    path,
};