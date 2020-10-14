import { Application, NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import cors = require("cors");
import { errors as celebrateErrors } from "celebrate";

import { ImATeapotError, NotFoundError } from "../types/httperrors";
import Logger from "./logger";
import apiRoutes from "../api";

export default (app: Application): void => {
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
      next(new ImATeapotError());
    }
  );
  Logger.debug("Loaded /teapot route");

  app.use(json());
  Logger.debug("JSON middleware added");

  app.use(cors());
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
      res.send({ errors: { message: err.message } });
    }
  );
  Logger.debug("Error handler added");
};
