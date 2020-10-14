import { Application } from "express";

import expressSetup from "./express";
import mongooseSetup from "./mongoose";
import Logger from "./logger";

export default async (app: Application): Promise<void> => {
  expressSetup(app);
  Logger.verbose("Express initialized");

  await mongooseSetup();
  Logger.verbose("Mongoose initialized");
};
