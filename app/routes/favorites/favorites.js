/**
 * Created by vladtomsa on 2019-02-12
 */
const express = require('express');
const favoritesController = require('../../controllers').favoritesController;
const validate = require('../../helpers/requestValidator');
const validationSchema = require('./validation');

const router = express.Router();
const path = "/favorites";

router
    .route('/')
    .get((req, res, next) => {
        const userId = req.userInfo.id;

        favoritesController.getUsersFavorites(userId)
            .then(data => res.status(200).send(data))
            .catch(next);
    })
    .post(
        validate({body: validationSchema.createFavNotaryInfo}),
        (req, res, next) => {
        const userId = req.userInfo.id;
        const notaryId = req.body.notaryId;

        favoritesController.create(userId, notaryId)
            .then(data => res.status(200).send(data))
            .catch(next);
    });

router
    .route('/:id')
    .delete(
        validate({params: validationSchema.removeFavNotaryInfo}),
        (req, res, next) => {
        const userId = req.userInfo.id;
        const id = req.params.id;
        favoritesController.remove(userId, id)
            .then(data => res.status(200).send(data))
            .catch(next);
    });

module.exports = {
    router,
    path,
};