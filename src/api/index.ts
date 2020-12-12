import { Router } from "express";

import v1 from "./v1";

export default (): Router => {
  const router = Router();

  router.use("/v1", v1());

  return router;
};
