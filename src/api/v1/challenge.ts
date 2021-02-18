import { NextFunction, Request, Response, Router } from "express";
import Challenge from "../../services/Challenge";

export default (): Router => {
  const router = Router();

  router.post("/", createChallenge);

  return router;
};

const challengeService = new Challenge();

function createChallenge(req: Request, res: Response, next: NextFunction) {
  challengeService
    .createChallenge(req.user, req.team, req.ctf, req.body)
    .then((challenge) => res.status(201).send(challenge))
    .catch((err) => next(err));
}
