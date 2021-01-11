import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import Logger from "../../loaders/logger";
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

  router.use("/:teamID", authAndTeam);

  router
    .route("/:teamID")
    .get(getTeam)
    .patch(verifyUpdateTeam, updateTeam)
    .delete(deleteTeam)
    .all(notImplemented);
  router
    .route("/:teamID/updateOwner")
    .post(verifyUpdateOwner, updateOwner)
    .all(notImplemented);
  router.route("/:teamID/leave").post(leaveTeam).all(notImplemented);

  router
    .route("/:teamID/invite")
    .post(verifyCreateInvite, createInvite)
    .all(notImplemented);
  router
    .route("/:teamID/invite/:inviteID")
    .delete(deleteInvite)
    .all(notImplemented);

  // .all((_req: Request, _res: Response, next: NextFunction) => next(new NotImplementedError()));

  return router;
};

const teamService = new TeamService();

function createTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Creating new team");
  Logger.debug({ ...req.body });
  teamService
    .createTeam(req.headers.authorization.slice(7), req.body.teamName)
    .then((teamData) => {
      Logger.silly("Sending team data for new team");
      res.status(201).send(teamData);
    })
    .catch((err) => next(err));
}

function getTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Getting information on a team");
  Logger.debug({ ...req.body });
  teamService
    .getTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then((teamDetails) => {
      Logger.silly("Sending team data");
      res.send(teamDetails);
    })
    .catch((err) => next(err));
}

function updateTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Updating team details");
  Logger.debug({ ...req.body });
  teamService
    .updateTeam(req.headers.authorization.slice(7), req.params.teamID, req.body)
    .then((teamDetails) => {
      Logger.silly("Sending new team details");
      res.status(200).send(teamDetails);
    })
    .catch((err) => next(err));
}

function updateOwner(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Changing team owner");
  Logger.debug({ ...req.body });
  teamService
    .updateOwner(
      req.headers.authorization.slice(7),
      req.params.teamID,
      req.body.newOwner
    )
    .then((teamDetails) => {
      Logger.silly("Sending new team details");
      res.send(teamDetails);
    })
    .catch((err) => next(err));
}

function createInvite(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Creating new team invite");
  Logger.debug({ ...req.body, ...req.params });
  teamService
    .createInvite(
      req.headers.authorization.slice(7),
      req.params.teamID,
      req.body
    )
    .then((data) => {
      Logger.silly("Sending invite data");
      res.status(201).send(data);
    })
    .catch((err) => next(err));
}

function deleteInvite(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Deleting team invite");
  Logger.debug({ ...req.params });
  teamService
    .deleteInvite(req.headers.authorization.slice(7), req.params.inviteID)
    .then(() => {
      Logger.silly("Sending status 204 for successful deletion");
      res.sendStatus(204);
    })
    .catch((err) => next(err));
}

function leaveTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Leaving team");
  Logger.debug({ ...req.params });
  teamService
    .leaveTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then(() => {
      Logger.silly("Sending status 204 for successful leave");
      res.sendStatus(204);
    })
    .catch((err) => next(err));
}

function deleteTeam(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose("Deleting team");
  Logger.debug({ ...req.params });
  teamService
    .deleteTeam(req.headers.authorization.slice(7), req.params.teamID)
    .then(() => {
      Logger.silly("Sending status 204 for successful deletion");
      res.sendStatus(204);
    })
    .catch((err) => next(err));
}
