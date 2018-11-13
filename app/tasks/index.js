/**
 * Created by vladtomsa on 27/09/2018
 */
const emailSender = require('./emailSender');
const retriveAddressGeolocation = require('./retriveAddressGeolocation');

const getCronInterval = (interval = {}) => {
    const seconds = interval.seconds ? `*/${interval.seconds}` : '*';
    const minutes = interval.minutes ? `*/${interval.minutes}` : '*';
    const hour = interval.hours ? `*/${interval.hours}` : '*';
    const dayOfMonth = interval.dayOfMonth ? `${interval.dayOfMonth}` : '*';
    const month = interval.month ? `${interval.month}` : '*';
    const dayOfWeek = interval.dayOfWeek ? `${interval.dayOfWeek}` : '*';

    /*
     CRON scheduler structure
     # ┌────────────── second (optional)
     # │ ┌──────────── minute
     # │ │ ┌────────── hour
     # │ │ │ ┌──────── day of month
     # │ │ │ │ ┌────── month
     # │ │ │ │ │ ┌──── day of week
     # │ │ │ │ │ │
     # │ │ │ │ │ │
     # * * * * * *
    * */
    return `${seconds} ${minutes} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
};

const emailSenderTask = (app) => {
    const emailTask = emailSender(app);

    return {
        interval: getCronInterval(emailTask.interval),
        task: emailTask.task,
    };
};

const retriveAddressGeolocationTask = (app) => {
    const retrieveTask = retriveAddressGeolocation(app);

    return {
        interval: getCronInterval(retrieveTask.interval),
        task: retrieveTask.task,
    };
};

module.exports = [
    emailSenderTask,
    retriveAddressGeolocationTask,
];

