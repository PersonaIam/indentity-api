/**
 * Created by vladtomsa on 08/10/2018
 */
const authorizationMiddleware = require('./authorization');
const errorHandlerMiddleware = require('./errorHandler');
const reqBodyValidatorMiddleware = require('./reqBodyValidator');

module.exports = {
    authorizationMiddleware,
    errorHandlerMiddleware,
    reqBodyValidatorMiddleware,
};