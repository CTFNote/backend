import { Application, NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import cors = require("cors");
import { errors as celebrateErrors } from "celebrate";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { ImATeapotError, NotFoundError } from "../types/httperrors";
import Logger, { HTTPStream } from "./logger";
import apiRoutes from "../api";
import config from "../config";
import { ErrorResponse } from "../types";

// @ts-expect-error Some typing is broken i assume
const morganInstance = morgan("combined", { stream: HTTPStream });

export default (app: Application): void => {
  app.use(morganInstance);

  app.get("/status", (req, res) => {
    res.status(200).send("Ok").end();
    Logger.http("Recieved call to /status");
  });
  app.head("/status", (req, res) => {
    res.status(200).send("Ok").end();
    Logger.http("Recieved call to /status");
  });
  Logger.debug("Loaded /status routes");

  app.all(
    "/teapot",
    (req: Request, res: Response, next: NextFunction): void => {
      next(
        new ImATeapotError({
          errorCode: "error_teapot",
          details:
            'Any attempt to brew coffee with a teapot should result in the error code "418 I\'m a teapot". The resulting entity body MAY be short and stout.',
        })
      );
    }
  );
  Logger.debug("Loaded /teapot route");

  app.use(json());
  Logger.debug("JSON middleware added");

  app.use(cookieParser());
  Logger.debug("Cookie parser added");

  app.use(cors({ origin: config.get("cors"), credentials: true }));
  Logger.debug("CORS middleware added");

  app.disable("x-powered-by");
  Logger.debug('Disabled "x-powered-by"');

  app.use("/api", apiRoutes());
  Logger.debug("API routes loaded");

  app.use(celebrateErrors());
  Logger.debug("Celebrate middleware added");

  app.use((req: Request, res: Response, next: NextFunction): void => {
    next(new NotFoundError());
  });
  Logger.debug("404 route added");

  app.use(
    (err: any, req: Request, res: Response, _next: NextFunction): void => {
      res.status(err.statusCode || 500);
      const response: ErrorResponse = { errors: { message: err.message } };
      if (err.details) response.errors.details = err.details;
      if (err.errorCode) response.errors.errorCode = err.errorCode;
      res.send(response);
    }
  );
  Logger.debug("Error handler added");
};
