import { Router } from "express";

import auth from "./auth";
import team from "./team";
import user from "./user";
import invite from "./invite";
import Logger from "../../loaders/logger";

export default (): Router => {
  const router = Router();

  Logger.debug("Registering /api/v1 routes");
  router.use("/auth", auth());
  router.use("/user", user());
  router.use("/team", team());
  router.use("/invite", invite());

  return router;
};
