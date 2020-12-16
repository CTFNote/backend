import { celebrate, Segments, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import TeamService from "../../services/Team";

const verifyInvite = celebrate({
  [Segments.PARAMS]: Joi.object({
    inviteID: Joi.string().length(6).hex(),
  }),
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().regex(
      /^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/
    ),
  }).unknown(true),
});

export default (): Router => {
  const router = Router();

  router.get("/:inviteID", verifyInvite, getInvite);

  return router;
};

const teamService = new TeamService();

function getInvite(req: Request, res: Response, next: NextFunction) {
  teamService
    .getInvite(req.headers.authorization?.slice(7), req.params.inviteID)
    .then((invite) => res.send(invite))
    .catch((err) => next(err));
}
