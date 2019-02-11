/**
 * Created by vladtomsa on 27/09/2018
 */
const emailSender = require('./emailSender');
const removeUnconfrimed = require('./removeUnconfirmedUsers');
const retriveAddressGeolocation = require('./retriveAddressGeolocation');

/**
 * Generates a CRON scheduler structure
 * CRON scheduler structure
 * ┌────────────── second (optional)
 * │ ┌──────────── minute
 * │ │ ┌────────── hour
 * │ │ │ ┌──────── day of month
 * │ │ │ │ ┌────── month
 * │ │ │ │ │ ┌──── day of week
 * │ │ │ │ │ │
 * │ │ │ │ │ │
 * * * * * * *
 *
 * For '*\/number' the task will run every number of units
 * eq: *\/3 * * * * * will run every 3 seconds
 *
 * @param(interval: Object)
 * @param(isFixedTime: bool) if true run at a precise time eq: 11:00 PM and not every X time
 * */
const getCronInterval = (interval = {}, isFixedTime) => {
    const seconds = interval.seconds ? `${isFixedTime ? '' : '*/'}${interval.seconds}` : '*';
    const minutes = interval.minutes ? `${isFixedTime ? '' : '*/'}${interval.minutes}` : '*';
    const hour = interval.hours ? `${isFixedTime ? '' : '*/'}${interval.hours}` : '*';
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
    const { interval, task } = emailSender(app);

    return {
        interval: getCronInterval(interval),
        task: task,
    };
};

const retriveAddressGeolocationTask = (app) => {
    const { interval, task } = retriveAddressGeolocation(app);

    return {
        interval: getCronInterval(interval),
        task: task,
    };
};


const removeUnconfirmedUsersTask = () => {
    const { interval, task } = removeUnconfrimed();

    return {
        interval: getCronInterval(interval, true),
        task: task,
    };
};

module.exports = [
    emailSenderTask,
    retriveAddressGeolocationTask,
    removeUnconfirmedUsersTask,
];

