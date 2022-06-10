const winston = require("winston");

const messageFormat = print(({ timestamp, level, message }) => {
    return `${timestamp}[${level}]: ${message}`;
});

export const logger = winston.createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: "DD-MM-YYYY HH:mm:ss"
        }),
        messageFormat
    ),
    transports: [
        new winston.transports.File({
            filename: application.log
        })
    ]
});
