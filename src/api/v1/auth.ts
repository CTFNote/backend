import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import Logger from "../../loaders/logger";
import AuthService from "../../services/Auth";
import { notImplemented } from "../../util";
import { refreshToken as joiRefreshToken } from "../../util/celebrate";
import { authRateLimit } from "../../util/rateLimits";

const authService = new AuthService();

const newUserVerification = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string()
      .min(3)
      .regex(/^[a-zA-Z0-9_\-.]{3,32}$/)
      .required(),
    password: Joi.string()
      .min(8)
      .regex(
        /^(?=(?:.*[A-Z]){1,})(?=.*[!@#$&*]{1,})(?=(?:.*[0-9]){1,})(?=(?:.*[a-z]){1,}).{8,}$/
      )
      .required(),
  }),
});

const verifyLoginCreds = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
  }),
});

export default (): Router => {
  const router = Router();

  router
    .route("/register")
    .all(authRateLimit)
    .post(newUserVerification, register)
    .all(notImplemented);
  router
    .route("/login")
    .all(authRateLimit)
    // LGTM issue is disabled because i am actually using rate limiting, but for some reason LGTM
    // isn't picking it up.
    .post(verifyLoginCreds, login) // lgtm [js/missing-rate-limiting]
    .all(notImplemented);
  router
    .route("/logout")
    .post(
      celebrate({
        [Segments.COOKIES]: Joi.object({
          refreshToken: joiRefreshToken,
        }),
      }),
      logout
    )
    .all(notImplemented);
  router
    .route("/refresh-token")
    .post(
      celebrate({
        [Segments.COOKIES]: Joi.object({
          refreshToken: joiRefreshToken.required(),
        }),
      }),
      refreshToken
    )
    .all(notImplemented);

  return router;
};

async function register(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Registering new user");
  Logger.debug({ username: req.body.username });
  await authService
    .registerUser(req.body.username, req.body.password, req.ip)
    .then(({ refreshToken, ...user }) => {
      Logger.silly("Setting cookie");
      authService.setRefreshTokenCookie(res, refreshToken);
      Logger.silly("Returning new user data");
      res.status(201).send(user);
    })
    .catch((err) => next(err));
}

async function login(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Authenticating user");
  Logger.debug({ username: req.body.username });
  await authService
    .authenticateUser(req.body.username, req.body.password, req.ip)
    .then(({ refreshToken, ...user }) => {
      Logger.silly("Setting cookie");
      authService.setRefreshTokenCookie(res, refreshToken);
      Logger.silly("Returning user data");
      res.status(200).send(user);
    })
    .catch((err) => next(err));
}

async function logout(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Logging out user");
  await authService
    .logoutUser(req.cookies.refreshToken, req.ip, res)
    .then(() => {
      Logger.silly("Returning with status 204");
      res.status(204).send();
    })
    .catch((err) => next(err));
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  Logger.verbose("Generating new refresh token");
  await authService
    .regenerateRefreshToken(req.cookies.refreshToken, req.ip)
    .then(({ refreshToken, ...user }) => {
      Logger.silly("Setting new refresh token");
      authService.setRefreshTokenCookie(res, refreshToken);
      Logger.silly("Returning user data");
      res.status(200).send(user);
    })
    .catch((err) => next(err));
}
