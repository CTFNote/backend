import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import TeamService from "../../services/Team";
import { UnauthorizedError } from "../../types/httperrors";

const verifyTeamCreation = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().regex(
      /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/
    ).optional(),
  }).unknown(true),
  [Segments.BODY]: Joi.object({
    teamName: Joi.string().required().min(3).max(64),
  }),
});

export default (): Router => {
  const router = Router();

  router.post("/", verifyTeamCreation, createTeam);

  return router;
};

const teamService = new TeamService();

function createTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .createTeam(req.headers.authorization.slice(7), req.body.teamName)
    .then((teamData) => res.status(201).send(teamData))
    .catch((err) => next(err));
}
