import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import TeamService from "../../services/Team";
import { UnauthorizedError } from "../../types/httperrors";
import { notImplemented } from "../../util";
import {
  mongoDbObjectId,
  teamName,
  verifyAuthHeader,
  verifyTeamID,
} from "../../util/celebrate";

const verifyTeamCreation = celebrate({
  [Segments.BODY]: Joi.object({
    teamName: teamName.required(),
  }),
});

const verifyUpdateTeam = celebrate({
  [Segments.BODY]: Joi.object({
    name: teamName,
    socials: Joi.object({
      website: Joi.string().uri(),
      twitter: Joi.string().regex(/^@?(\w){1,15}$/),
    }),
  }),
});

const verifyUpdateOwner = celebrate({
  [Segments.BODY]: Joi.object({
    newOwner: mongoDbObjectId.required(),
  }),
});

const verifyCreateInvite = celebrate({
  [Segments.BODY]: Joi.object({
    maxUses: Joi.number().max(100).min(0),
    expiry: Joi.date(),
  }),
});

const authAndTeam = [verifyAuthHeader, verifyTeamID];

export default (): Router => {
  const router = Router();

  router
    .route("/")
    .post(verifyAuthHeader, verifyTeamCreation, createTeam)
    .all();

  router
    .route("/:teamID")
    .get(authAndTeam, getTeam)
    .patch(authAndTeam, verifyUpdateTeam, updateTeam)
    .delete(authAndTeam, deleteTeam)
    .all(notImplemented);
  router
    .route("/:teamID/updateOwner")
    .post(authAndTeam, verifyUpdateOwner, updateOwner)
    .all(notImplemented);
  router
    .route("/:teamID/leave")
    .post(authAndTeam, leaveTeam)
    .all(notImplemented);

  router
    .route("/:teamID/invite")
    .post(authAndTeam, verifyCreateInvite, createInvite)
    .all(notImplemented);
  router
    .route("/:teamID/invite/:inviteID")
    .delete(authAndTeam, deleteInvite)
    .all(notImplemented);

  // .all((_req: Request, _res: Response, next: NextFunction) => next(new NotImplementedError()));

  return router;
};

const teamService = new TeamService();

function createTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
  }

  teamService
    .createTeam(req.headers.authorization.slice(7), req.body.teamName)
    .then((teamData) => res.status(201).send(teamData))
    .catch((err) => next(err));
}

function getTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
  }

  teamService
    .getTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then((teamDetails) => res.send(teamDetails))
    .catch((err) => next(err));
}

function updateTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
  }

  teamService
    .updateTeam(req.headers.authorization.slice(7), req.params.teamID, req.body)
    .then((teamDetails) => res.status(200).send(teamDetails))
    .catch((err) => next(err));
}

function updateOwner(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
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
    return next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
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

function deleteInvite(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
  }

  teamService
    .deleteInvite(req.headers.authorization.slice(7), req.params.inviteID)
    .then(() => res.sendStatus(204))
    .catch((err) => next(err));
}

function leaveTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
  }

  teamService
    .leaveTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then(() => res.sendStatus(204))
    .catch((err) => next(err));
}

function deleteTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ errorMessage: "Missing authorization" }));
  }

  teamService
    .deleteTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then(() => res.sendStatus(204))
    .catch((err) => next(err));
}
