/**
 * Created by vladtomsa on 05/11/2018
 */
/**
 * Created by vladtomsa on 27/09/2018
 */
'use strict';
const express = require('express');
const notariesController = require('../../controllers').notariesController;

const router = express.Router();
const path = "/notaries";

router
    .route('/')
        .get((req, res) => {
            const params = {
                ...req.params,
                ...req.query,
            };

            notariesController.list(params)
                .then(data => res.status(200).send(data))
                .catch(error => res.status(400).send(error));
        })
        .post(
            // validate({body: validationSchema.createUser}),
            (req, res) => {
                notariesController.create(req.body)
                .then(data => {
                    res.status(200).send(data)
                })
                .catch(error => {
                    res.status(400).send(error)
                });
        });

router
    .route('/by-location')
        .get((req, res) => {
            const params = {
                ...req.params,
                ...req.query,
            };

            notariesController.listByLocation(params)
                .then(data => res.status(200).send(data))
                .catch(error => res.status(400).send(error));
        });

module.exports = {
    router,
    path,
};