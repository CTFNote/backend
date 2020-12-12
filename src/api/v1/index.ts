import { Router } from "express";
import auth from "./auth";
import team from "./team";
import user from "./user";

export default (): Router => {
  const router = Router();

  router.use("/auth", auth());
  router.use("/user", user());
  router.use("/team", team());

  return router;
};
