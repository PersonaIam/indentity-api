/**
 * Created by vladtomsa on 23/01/2019
 */
const winston = require('winston');

const { format: { combine, timestamp } } = winston;

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        winston.format.json(),
    ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs.log',
            options: {
                flags: isProduction
                    ? 'a' // continue log
                    : 'w' // clear log on restart
            },
        }),
    ],
});

//
// If we're not in production then log error to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!isProduction) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
        level: 'error'
    }));
}

logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = logger;