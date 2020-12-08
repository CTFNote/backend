import { NextFunction, Request, Response, Router } from "express";

import UserService from "../../services/User";
import { UnauthorizedError } from "../../types/httperrors";

export default (): Router => {
  const router = Router();

  router.patch("/", updateDetails);

  return router;
};

const userService = new UserService();

async function updateDetails(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  userService
    .updateDetails(req.headers.authorization.slice(7), req.body)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
}
