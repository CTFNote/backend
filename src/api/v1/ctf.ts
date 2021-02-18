import { NextFunction, Request, Response, Router } from "express";
import Logger from "../../loaders/logger";

import CTFService from "../../services/CTF";
import { notImplemented } from "../../util";
import attachCTF from "../../util/middleware/ctf";
import attachUser from "../../util/middleware/user";
import challenge from "./challenge";

export default (): Router => {
  const router = Router({ mergeParams: true });

  router.use(attachUser(), attachCTF());
  router.use("/:ctfID/challenges", challenge());

  router.route("/").get(listCTFs).post(createCTF).all(notImplemented);
  router.route("/:ctfID").get(getCTF).all(notImplemented);
  router.route("/:ctfID/archive").post(archiveCTF).all(notImplemented);
  router.route("/:ctfID/unarchive").post(unarchiveCTF).all(notImplemented);

  return router;
};

const _CTFService = new CTFService();

function createCTF(req: Request, res: Response, next: NextFunction) {
  Logger.verbose(`Creating new CTF for team ${req.team._id}`);
  Logger.debug(JSON.stringify({ ...req.body }));
  _CTFService
    .createCTF(req.user, req.team, req.body)
    .then((ctfDetails) => {
      res.status(201).send(ctfDetails);
    })
    .catch((err) => next(err));
}

function listCTFs(req: Request, res: Response, next: NextFunction) {
  Logger.verbose(`Getting list of CTFs for team ${req.team._id}`);
  _CTFService
    .listCTFs(
      req.user,
      req.team,
      req.body.includeArchived ?? undefined
    )
    .then((CTFs) => {
      res.status(200).send(CTFs);
    })
    .catch((err) => next(err));
}

function getCTF(req: Request, res: Response, next: NextFunction) {
  Logger.verbose(
    `Getting CTF with ID ${req.params.ctfID} from team ${req.team._id}`
  );
  _CTFService
    .getCTF(req.user, req.team, req.params.ctfID)
    .then((CTF) => {
      res.status(200).send(CTF);
    })
    .catch((err) => next(err));
}

function archiveCTF(req: Request, res: Response, next: NextFunction) {
  Logger.verbose(
    `Archiving CTF with ID ${req.params.ctfID} in team ${req.team._id}`
  );
  _CTFService
    .archiveCTF(req.user, req.team, req.params.ctfID)
    .then((CTF) => {
      res.status(200).send(CTF);
    })
    .catch((err) => next(err));
}

function unarchiveCTF(req: Request, res: Response, next: NextFunction) {
  Logger.verbose(
    `Unarchiving CTF with ID ${req.params.ctfID} in team ${req.team._id}`
  );
  _CTFService
    .unarchiveCTF(req.user, req.team, req.params.ctfID)
    .then((CTF) => {
      res.status(200).send(CTF);
    })
    .catch((err) => next(err));
}
