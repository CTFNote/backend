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

const verifyUpdateTeam = celebrate({
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
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(64),
    socials: Joi.object({
      website: Joi.string().uri(),
      twitter: Joi.string().regex(/^@?(\w){1,15}$/),
    }),
  }),
});

const verifyUpdateOwner = celebrate({
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
  [Segments.BODY]: Joi.object({
    newOwner: Joi.string()
      .regex(/^[a-f\d]{24}$/i)
      .required(),
  }),
});

const verifyCreateInvite = celebrate({
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
  [Segments.BODY]: Joi.object({
    maxUses: Joi.number().max(100).min(0),
    expiry: Joi.date()
  })
});

export default (): Router => {
  const router = Router();

  router.post("/", verifyTeamCreation, createTeam);
  router.get("/:teamID", verifyGetTeam, getTeam);
  router.patch("/:teamID", verifyUpdateTeam, updateTeam);
  router.post("/:teamID/updateOwner", verifyUpdateOwner, updateOwner);
  router.post("/:teamID/invite", verifyCreateInvite, createInvite);

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

function updateTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .updateTeam(req.headers.authorization.slice(7), req.params.teamID, req.body)
    .then((teamDetails) => res.status(200).send(teamDetails))
    .catch((err) => next(err));
}

function updateOwner(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .updateOwner(
      req.headers.authorization.slice(7),
      req.params.teamID,
      req.body.newOwner
    )
    .then((teamDetails) => res.send(teamDetails))
    .catch((err) => next(err));
}

function createInvite(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .createInvite(
      req.headers.authorization.slice(7),
      req.params.teamID,
      req.body
    )
    .then((data) => res.status(201).send(data))
    .catch((err) => next(err));
}
