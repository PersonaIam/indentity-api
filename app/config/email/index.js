/**
 * Created by vladtomsa on 27/09/2018
 */
const mailer = require('nodemailer-promise');
const sgTransport = require('nodemailer-sendgrid-transport'); // wrapper for nodemailer SMTP configuration

const init = (app, cb) => {
    const {
        email: {
            password,
        },
    } = app.get('config');

    const sendMail = mailer.config(sgTransport({
        auth: {
            api_key: password,
        },
    }));

    app.set('emailService', {
        sendMail: (message) => sendMail(message),
    });

    cb(null);
};

module.exports = {
    init,
};