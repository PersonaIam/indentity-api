/**
 * Created by vladtomsa on 27/09/2018
 */
'use strict';
const express = require('express');
const referralsController = require('../../controllers').referralsController;
const validate = require('../../helpers/requestValidator');
const validationSchema = require('./validation');

const router = express.Router();
const path = "/referrals";

router
    .route('/')
    .get(validate({query: validationSchema.getUserReferralInfo}), (req, res, next) => {
        const userId = req.userInfo.id;
        const referralCode = req.query.referralCode;

        referralsController.list({
            userId,
            referralCode,
        })
            .then(data => res.status(200).send(data))
            .catch(next);
    });

module.exports = {
    router,
    path,
};