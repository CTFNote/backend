import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import TeamService from "../../services/Team";
import { UnauthorizedError } from "../../types/httperrors";
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

  router.post("/", verifyAuthHeader, verifyTeamCreation, createTeam);
  router.get("/:teamID", authAndTeam, getTeam);
  router.patch("/:teamID", authAndTeam, verifyUpdateTeam, updateTeam);
  router.post(
    "/:teamID/updateOwner",
    authAndTeam,
    verifyUpdateOwner,
    updateOwner
  );
  router.post("/:teamID/invite", authAndTeam, verifyCreateInvite, createInvite);
  router.delete("/:teamID/invite/:inviteID", authAndTeam, deleteInvite);
  router.post("/:teamID/leave", verifyAuthHeader, verifyTeamID, leaveTeam);
  router.delete("/:teamID", verifyAuthHeader, verifyTeamID, deleteTeam);

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

function deleteInvite(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .deleteInvite(req.headers.authorization.slice(7), req.params.inviteID)
    .then(() => res.sendStatus(204))
    .catch((err) => next(err));
}

function leaveTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .leaveTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then(() => res.sendStatus(204))
    .catch((err) => next(err));
}

function deleteTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError({ message: "Missing authorization" }));
  }

  teamService
    .deleteTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then(() => res.sendStatus(204))
    .catch((err) => next(err));
}
