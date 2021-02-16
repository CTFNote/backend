import { celebrate, Segments, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import TeamService from "../../services/Team";
import { notImplemented } from "../../util";
import Logger from "../../loaders/logger";
import attachUser from "../../util/middleware/user";

const verifyInvite = celebrate({
  [Segments.PARAMS]: Joi.object({
    inviteID: Joi.string().length(6).hex(),
  }),
});

export default (): Router => {
  const router = Router();
  router.use(attachUser({ userOptional: true }));

  router
    .route("/:inviteID")
    .get(verifyInvite, getInvite)
    .post(verifyInvite, useInvite)
    .all(notImplemented);

  return router;
};

const teamService = new TeamService();

function getInvite(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Getting invite");
  Logger.debug({ inviteID: req.params.inviteID });
  teamService
    .getInvite(req.user, req.params.inviteID)
    .then((invite) => {
      Logger.silly("Sending invite data");
      res.send(invite);
    })
    .catch((err) => next(err));
}

function useInvite(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Using invite and adding user to team");
  teamService
    .useInvite(req.user, req.params.inviteID)
    .then((teamData) => {
      Logger.silly("Sending data about the team for the client");
      res.send(teamData);
    })
    .catch((err) => next(err));
}
