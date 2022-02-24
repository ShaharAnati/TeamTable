import * as winston from 'winston';
const { createLogger, transports, format } = winston;
const { timestamp, json, combine, splat } = format;

export const initLogger = async () => {
    const options: winston.LoggerOptions = {
        level: 'debug',
        handleExceptions: true

    }

    const logger = createLogger({
        transports: [
            new transports.Console(options)
        ],
        exitOnError: false,
        format: combine(
            splat(),
            timestamp(),
            json()
        )
    });

    console.log = (message, ...args) => logger.info(message, ...args);
    console.info = (message, ...args) => logger.info(message, ...args);
    console.warn = (message, ...args) => logger.warn(message, ...args);
    console.error = (message, ...args) => logger.error(message, ...args);
    console.debug = (message, ...args) => logger.debug(message, ...args);
}