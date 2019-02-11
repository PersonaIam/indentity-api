/**
 * Created by vladtomsa on 2019-02-11
 */
const logger = require('../config/logger');
const userController = require('../controllers').userController;

const removeUnconfirmedUsersJob = () => {
    return {
        interval: {
            seconds: '00',
            minutes: '00',
            hour: '00'
        },
        task: async () => {
            try {
                const { count } = await userController.removeUnconfirmedUsers();

                logger.info(`Removed ${count} unconfirmed accounts`);
            }
            catch (error) {
                logger.error('FAILED_TO_REMOVE_UNCONFIRMED_USERS');
                logger.error(error);
            }
        }
    };
};

module.exports = removeUnconfirmedUsersJob;