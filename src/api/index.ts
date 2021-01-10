import { Router } from "express";

import Logger from "../loaders/logger";
import v1 from "./v1";

export default (): Router => {
  const router = Router();

  Logger.debug("Registering /api routes");
  router.use("/v1", v1());

  return router;
};
