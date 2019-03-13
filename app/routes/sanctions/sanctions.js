/**
 * Created by vladtomsa on 2019-03-05
 */
const express = require('express');
const sanctionsController = require('../../controllers').sanctionsController;
const validate = require('../../helpers/requestValidator');
const validationSchema = require('./validation');

const router = express.Router();
const path = "/sanctions";

router
    .route('/')
    .post(
        validate({body: validationSchema.searchSanctions}),
        (req, res, next) => {
            sanctionsController.find(req.body)
                .then(data => res.status(200).send(data))
                .catch(next);
        });

module.exports = {
    router,
    path,
};