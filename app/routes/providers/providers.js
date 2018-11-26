/**
 * Created by vladtomsa on 22/11/2018
 */
'use strict';
const express = require('express');
const providersController = require('../../controllers').providersController;

const router = express.Router();
const path = "/providers";

router
    .route('/')
    .get((req, res) => {
        const params = {
            ...req.params,
            ...req.query,
        };

        providersController.list(params)
            .then(data => res.status(200).send(data))
            .catch(error => res.status(400).send(error));
    })
    .post(
        // validate({body: validationSchema.createUser}),
        (req, res) => {
            providersController.create(req)
                .then(data => {
                    res.status(200).send(data)
                })
                .catch(error => {
                    res.status(400).send(error)
                });
        });

module.exports = {
    router,
    path,
};