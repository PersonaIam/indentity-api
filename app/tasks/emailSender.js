/**
 * Created by vladtomsa on 27/09/2018
 */
const jwt = require('jsonwebtoken');
const moment = require('moment');
const usersController = require('../controllers').userController;
const getTemplateByFileName = require('../helpers/pugTemplateGenerator');

const self = {};

const sendUserRegistrationEmail = (email, {
   username,
   link,
   expirationData,
}) => {
    const app = self.app;
    const emailService = app.get('emailService');

    const emailTemplate = getTemplateByFileName('userRegistration.pug', {
        username,
        link,
        expirationData,
    });

    const mailOptions = {
        from: '"Persona Identity" <persona.identity.api@gmail.com>',
        to: email,
        subject: 'Persona Identity Management Registration ✔',
        html: emailTemplate,
    };

    return emailService.sendMail(mailOptions);
};

const sendRegistrationToUsers = (userInfoList) => {
    const app = self.app;

    const {
        constants: {
            DATE_TIME_FORMAT,
            REGISTRATION_LINK_EXPIRES_IN_HOURS,
            REGISTRATION_LINK_JWT_KEY,
        },
        web: {
            host,
            port,
        },
    } = app.get('config');

    if (userInfoList && userInfoList.length) {
        userInfoList.forEach((userInfo) => {
            const {id, username, createdAt, contactInfo: { email }} = userInfo;

            const token = jwt.sign(
                {
                    email,
                    username,
                },
                REGISTRATION_LINK_JWT_KEY,
                {
                    expiresIn: `${REGISTRATION_LINK_EXPIRES_IN_HOURS}h`
                },
            );

            const expirationData = moment(createdAt)
                .add(REGISTRATION_LINK_EXPIRES_IN_HOURS, 'hours')
                .format(DATE_TIME_FORMAT);

            const link = `${host}:${port}/account/confirmation/${token}`;

            const userEmailInfo = {
                username,
                link,
                expirationData,
            };

            sendUserRegistrationEmail(email, userEmailInfo)
                .then(() => {
                    confirmRegistrationEmailSent(id)
                })
                .catch((error) => {
                    console.log(error)
                });
        });
    }

};

const searchNewUsers = () => {
    usersController.getNewUsers()
        .then(({ userInfoList }) => sendRegistrationToUsers(userInfoList))
        .catch(error => console.log('err: ', error));
};

const confirmRegistrationEmailSent = (userId) => {
    usersController.update({ isRegEmailSent: true }, userId)
        .then(data => console.log('user updated: ', data.id))
        .catch(error => console.log('err: ', error));
};


const emailSender = (app) => {
    self.app = app;

    const {
        USER_REGISTRATION_EMAIL_TAKS_INTERVAL,
    } = app.get('config').constants;

    return {
        interval: {
            seconds: USER_REGISTRATION_EMAIL_TAKS_INTERVAL,
        },
        task: () => {
            searchNewUsers();
        }
    };
};

module.exports = emailSender;