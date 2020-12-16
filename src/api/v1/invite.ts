import { celebrate, Segments, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import { UnauthorizedError } from "../../types/httperrors";
import TeamService from "../../services/Team";
import { verifyAuthHeader } from "../../util/celebrate";

const verifyInvite = celebrate({
  [Segments.PARAMS]: Joi.object({
    inviteID: Joi.string().length(6).hex(),
  }),
});

export default (): Router => {
  const router = Router();

  router.get("/:inviteID", verifyAuthHeader, verifyInvite, getInvite);
  router.post("/:inviteID", verifyAuthHeader, verifyInvite, useInvite);

  return router;
};

const teamService = new TeamService();

function getInvite(req: Request, res: Response, next: NextFunction) {
  teamService
    .getInvite(req.headers.authorization?.slice(7), req.params.inviteID)
    .then((invite) => res.send(invite))
    .catch((err) => next(err));
}

function useInvite(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .useInvite(req.headers.authorization.slice(7), req.params.inviteID)
    .then((teamData) => res.send(teamData))
    .catch((err) => next(err));
}
