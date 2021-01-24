import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";

import CTFService from "../../services/CTF";
import { UnauthorizedError } from "../../types/httperrors";
import { notImplemented } from "../../util";

export default (): Router => {
  const router = Router({ mergeParams: true });

  router.route("/").post(createCTF).all(notImplemented);

  return router;
};

const _CTFService = new CTFService();

function createCTF(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  Logger.verbose(`Creating new CTF for team ${req.params.teamID}`);
  Logger.debug(JSON.stringify({ ...req.body }));
  _CTFService
    .createCTF(req.headers.authorization.slice(7), req.params.teamID, req.body)
    .then((ctfDetails) => {
      res.status(201).send(ctfDetails);
    })
    .catch((err) => next(err));
}
