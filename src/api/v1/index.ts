import { Router } from "express";

import auth from "./auth";
import team from "./team";
import user from "./user";
import invite from "./invite";

export default (): Router => {
  const router = Router();

  router.use("/auth", auth());
  router.use("/user", user());
  router.use("/team", team());
  router.use("/invite", invite());

  return router;
};
