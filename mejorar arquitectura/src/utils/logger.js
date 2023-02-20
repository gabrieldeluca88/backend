const winston = require ('winston');

const logConfiguration = {
    level: 'info',
    transports: [
        new winston.transports.Console({ level: 'silly' }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error', }),
        new winston.transports.File({ filename: './logs/warn.log', level: "warn"}),
    ],
};
const logger = winston.createLogger(logConfiguration);

module.exports = logger