import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import TeamService from "../../services/Team";
import { UnauthorizedError } from "../../types/httperrors";

const verifyTeamCreation = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string()
      .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/)
      .optional(),
  }).unknown(true),
  [Segments.BODY]: Joi.object({
    teamName: Joi.string().required().min(3).max(64),
  }),
});

const verifyGetTeam = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string()
      .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/)
      .optional(),
  }).unknown(true),
  [Segments.PARAMS]: Joi.object({
    teamID: Joi.string()
      .regex(/^[a-f\d]{24}$/i)
      .required(),
  }),
});

export default (): Router => {
  const router = Router();

  router.post("/", verifyTeamCreation, createTeam);
  router.get("/:teamID", verifyGetTeam, getTeam);

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

function getTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .getTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then((teamDetails) => res.send(teamDetails))
    .catch((err) => next(err));
}
