import { NextFunction, Request, Response, Router } from "express";
import TeamService from "../../services/Team";
import { UnauthorizedError } from "../../types/httperrors";

export default (): Router => {
  const router = Router();

  router.post("/", createTeam);

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
