import { NextFunction, Request, Response, Router } from "express";

import Logger from "../../loaders/logger";
import UserService from "../../services/User";
import { NotFoundError } from "../../types/httperrors";
import { notImplemented } from "../../util";
import attachUser from "../../util/middleware/user";

export default (): Router => {
  const router = Router();
  router.use(attachUser());

  router.route("/").patch(updateDetails).all(notImplemented);
  router.route("/:userID?").get(getDetails).get(deleteUser).all(notImplemented);

  return router;
};

const userService = new UserService();

async function updateDetails(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Updating user details");
  Logger.debug({ ...req.body });
  userService
    .updateDetails(req.user, req.body)
    .then(() => {
      Logger.silly("Sending status 204 for confirmed new details");
      res.status(204).send();
    })
    .catch((err) => next(err));
}

async function getDetails(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Getting user details");
  Logger.debug({ ...req.params });
  userService
    .getDetails(
      req.user,
      req.params.userID ? { user: req.params.userID } : undefined
    )
    .then((userData) => {
      Logger.silly("Sending user details");
      userData ? res.send(userData) : next(new NotFoundError());
    })
    .catch((err) => next(err));
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("User has requested deletion");
  Logger.debug({ ...req.body });
  userService
    .deleteUser(
      req.user,
      req.params.userID ? { user: req.params.userID } : undefined
    )
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => next(err));
}
