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
    .get((req, res, next) => {
        subscriptionController.list(req)
            .then(data => res.status(200).send(data))
            .catch(next);
    })
    .post(validate({body: validationSchema.createSubscription}), (req, res, next) => {
        subscriptionController.create(req)
            .then(data => res.status(200).send(data))
            .catch(next);
    });

module.exports = {
    router,
    path,
};