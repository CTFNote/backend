import * as winston from "winston";
import config from "../config";

const transports = [];
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: "HH:mm:ss.SSS",
      }),
      winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  })
);

const LoggerInstance = winston.createLogger({
  level: config.get("logging.level"),
  /**
   * Levels:
   *   error: 0,
   *   warn: 1,
   *   info: 2,
   *   http: 3,
   *   verbose: 4,
   *   debug: 5,
   *   silly: 6
   */
  levels: winston.config.npm.levels,

  // This may be added in later, but for now its not needed
  // format: winston.format.combine(
  //   winston.format.timestamp({
  //     format: "YYYY-MM-DD HH:mm:ss",
  //   }),
  //   winston.format.errors({ stack: true }),
  //   winston.format.splat(),
  //   winston.format.json()
  // ),
  transports,
});

export default LoggerInstance;
