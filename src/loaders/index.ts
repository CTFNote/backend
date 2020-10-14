import { Application } from "express";

import expressSetup from "./express";
import mongooseSetup from "./mongoose";
import Logger from "./logger";

export default async (app: Application): Promise<void> => {
  expressSetup(app);
  Logger.info("Express initialized");

  await mongooseSetup();
  Logger.info("Mongoose initialized");
};
