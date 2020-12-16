import { celebrate, Segments, Joi } from "celebrate";

export { verifyAuthHeader, verifyTeamID, teamName, mongoDbObjectId };

const verifyAuthHeader = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string()
      .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/)
      .optional(),
  }).unknown(true),
});

const verifyTeamID = celebrate({
  [Segments.PARAMS]: Joi.object({
    teamID: Joi.string()
      .regex(/^[a-f\d]{24}$/i)
      .required(),
  }),
});

const teamName = Joi.string().min(3).max(64);
const mongoDbObjectId = Joi.string().regex(/^[a-f\d]{24}$/i);
