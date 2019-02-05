/**
 * Created by vladtomsa on 2019-02-05
 */
const Sequelize = require('sequelize');

const errorHandler = async (error, req, res, next) => {
    if (error instanceof  Sequelize.Error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send(new Error(`${Object.keys(error.fields).join(', ')} unavailable`).toString());
        }
        else {
            res.status(400).send(new Error(`${error.name}: ${error.message}`).toString());
        }
    }
    else {
        res.status(400).send(error.message ? error.message : error);
    }
};

module.exports = errorHandler;