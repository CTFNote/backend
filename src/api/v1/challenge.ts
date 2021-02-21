import { NextFunction, Request, Response, Router } from "express";
import Challenge from "../../services/Challenge";

export default (): Router => {
  const router = Router();

  router.post("/", createChallenge);
  router.get("/:challengeID", getChallenge);

  return router;
};

const challengeService = new Challenge();

function createChallenge(req: Request, res: Response, next: NextFunction) {
  challengeService
    .createChallenge(req.user, req.team, req.ctf, req.body)
    .then((challenge) => res.status(201).send(challenge))
    .catch((err) => next(err));
}

function getChallenge(req: Request, res: Response, next: NextFunction) {
  challengeService
    .getChallenge(req.user, req.team, req.ctf, req.params.challengeID)
    .then((challenge) => res.status(200).send(challenge))
    .catch((err) => next(err));
}
