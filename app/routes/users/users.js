/**
 * Created by vladtomsa on 27/09/2018
 */
'use strict';
const express = require('express');
const usersController = require('../../controllers').userController;
const validate = require('../../helpers/requestValidator');
const { extractUserInfo } = require('../../helpers/extractEncryptedInfo');
const validationSchema = require('./validation');

const router = express.Router();
const path = "/users";

router
    .route('/')
        .post(validate({body: validationSchema.createUser}), (req, res, next) => {
            usersController.create(req)
                .then(data => res.status(200).send(data))
                .catch(next);
        });

router
    .route('/confirm')
        .put(validate({ body: validationSchema.confirmUser }), (req, res, next) => {
            usersController.confirmUser(req.body)
                .then(data => res.status(200).send(data))
                .catch(next);
        });

/**
 * We added a basic authorization check to the request.
 * This means that before the requests get's here, the user's credentials are checked.
 * If they are valid, the userInfo property is added to the request.
 * Otherwise, the request is rejected
 * */
router
    .route('/login')
    .get((req, res) => {
        const userInfo = req.userInfo;

        // req.session.userInfo = userInfo;

        res
            .status(200)
            .send(extractUserInfo(userInfo));
    });

router
    .route('/:id')
        .get((req, res, next) => {
            const findParams = {
              id: req.params.id,
            };
            usersController.list(findParams)
                .then(({ userInfoList }) => res.status(200).send(userInfoList[0]))
                .catch(next);
        })
        .put(validate({body: validationSchema.createUser}), (req, res, next) => {
            if (req.userInfo.id !== req.body.id) {
                return next('INVALID_USER_PERFORMING_THIS_OPERATION')
            }

            usersController.update(req.body, req.params.id)
                .then(data => res.status(200).send(data))
                .catch(next);
        });

module.exports = {
    router,
    path,
};