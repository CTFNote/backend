import { NextFunction, Request, Response } from "express";

import { Middleware } from "../../types";
import { verifyTeamID } from "../celebrate";
import { TeamModel } from "../../models/Team";
import { InternalServerError, NotFoundError } from "../../types/httperrors";

export default (): Array<Middleware> => {
  return [
    verifyTeamID,
    async function (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      const team = await TeamModel.findById(req.params.teamID)
        .then()
        .catch(() => next(new InternalServerError()));

      if (!team) {
        return next(new NotFoundError({ errorCode: "error_team_not_found" }));
      }

      req.team = team;
      return next();
    },
  ];
};
