import { celebrate, Segments, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import { UnauthorizedError } from "../../types/httperrors";
import TeamService from "../../services/Team";
import { verifyAuthHeader } from "../../util/celebrate";
import { notImplemented } from "../../util";
import Logger from "../../loaders/logger";

const verifyInvite = celebrate({
  [Segments.PARAMS]: Joi.object({
    inviteID: Joi.string().length(6).hex(),
  }),
});

export default (): Router => {
  const router = Router();

  router
    .route("/:inviteID")
    .get(verifyAuthHeader, verifyInvite, getInvite)
    .post(verifyAuthHeader, verifyInvite, useInvite)
    .all(notImplemented);

  return router;
};

const teamService = new TeamService();

function getInvite(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Getting invite");
  Logger.debug({ inviteID: req.params.inviteID });
  teamService
    .getInvite(req.headers.authorization?.slice(7), req.params.inviteID)
    .then((invite) => {
      Logger.silly("Sending invite data");
      res.send(invite);
    })
    .catch((err) => next(err));
}

function useInvite(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({ errorMessage: "Missing authorization" })
    );
  }

  Logger.verbose("Using invite and adding user to team");
  teamService
    .useInvite(req.headers.authorization.slice(7), req.params.inviteID)
    .then((teamData) => {
      Logger.silly("Sending data about the team for the client");
      res.send(teamData);
    })
    .catch((err) => next(err));
}
