import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import Logger from "../../loaders/logger";
import UserService from "../../services/User";
import { NotFoundError, UnauthorizedError } from "../../types/httperrors";
import { notImplemented } from "../../util";
import { mongoDbObjectId } from "../../util/celebrate";

const verifyUserID = celebrate({
  [Segments.PARAMS]: Joi.object({ userID: mongoDbObjectId }).optional(),
});

export default (): Router => {
  const router = Router();

  router.route("/").patch(updateDetails).all(notImplemented);
  router
    .route("/:userID?")
    .get(verifyUserID, getDetails)
    .get(verifyUserID, deleteUser)
    .all(notImplemented);

  return router;
};

const userService = new UserService();

async function updateDetails(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Updating user details");
  Logger.debug({ ...req.body });
  userService
    .updateDetails(req.headers.authorization.slice(7), req.body)
    .then(() => {
      Logger.silly("Sending status 204 for confirmed new details");
      res.status(204).send();
    })
    .catch((err) => next(err));
}

async function getDetails(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Getting user details");
  Logger.debug({ ...req.params });
  userService
    .getDetails(
      req.headers.authorization.slice(7),
      req.params.userID ? { user: req.params.userID } : undefined
    )
    .then((userData) => {
      Logger.silly("Sending user details");
      userData ? res.send(userData) : next(new NotFoundError());
    })
    .catch((err) => next(err));
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    throw new UnauthorizedError({
      errorMessage: "Missing authorization",
      errorCode: "error_unauthorized",
    });
  }

  Logger.verbose("User has requested deletion");
  Logger.debug({ ...req.body });
  userService
    .deleteUser(
      req.headers.authorization.slice(7),
      req.params.userID ? { user: req.params.userID } : undefined
    )
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => next(err));
}
