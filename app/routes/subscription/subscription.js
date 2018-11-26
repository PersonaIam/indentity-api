/**
 * Created by vladtomsa on 27/09/2018
 */
'use strict';
const express = require('express');
const subscriptionController = require('../../controllers').subscriptionController;
const validate = require('../../helpers/requestValidator');
const validationSchema = require('./validation');

const router = express.Router();
const path = "/subscription";

router
    .route('/')
    .get((req, res) => {
        subscriptionController.list(req)
            .then(data => res.status(200).send(data))
            .catch(error => res.status(400).send(error));
    })
    .post(validate({body: validationSchema.createSubscription}), (req, res) => {
        subscriptionController.create(req)
            .then(data => res.status(200).send(data))
            .catch(error => res.status(400).send(error));
    });

module.exports = {
    router,
    path,
};