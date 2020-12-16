import { NextFunction, Request, Response, Router } from "express";

import UserService from "../../services/User";
import { NotFoundError, UnauthorizedError } from "../../types/httperrors";

export default (): Router => {
  const router = Router();

  router.patch("/", updateDetails);
  router.get("/:userID?", getDetails);

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

async function getDetails(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  userService
    .getDetails(
      req.headers.authorization.slice(7),
      req.params.userID ? { user: req.params.userID } : undefined
    )
    .then((userData) =>
      userData ? res.send(userData) : next(new NotFoundError())
    )
    .catch((err) => next(err));
}
