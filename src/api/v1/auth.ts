import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import AuthService from "../../services/Auth";
import { notImplemented } from "../../util";
import { refreshToken as joiRefreshToken } from "../../util/celebrate";

const authService = new AuthService();

const newUserVerification = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string()
      .min(3)
      .regex(/^([a-zA-Z0-9_.]|[^\s])+$/)
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
    .post(newUserVerification, register)
    .all(notImplemented);
  router.route("/login").post(verifyLoginCreds, login).all(notImplemented);
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
  await authService
    .registerUser(req.body.username, req.body.password, req.ip)
    .then(({ refreshToken, ...user }) => {
      authService.setRefreshTokenCookie(res, refreshToken);
      res.status(201).send(user);
    })
    .catch((err) => next(err));
}

async function login(req: Request, res: Response, next: NextFunction) {
  await authService
    .authenticateUser(req.body.username, req.body.password, req.ip)
    .then(({ refreshToken, ...user }) => {
      authService.setRefreshTokenCookie(res, refreshToken);
      res.status(200).send(user);
    })
    .catch((err) => next(err));
}

async function logout(req: Request, res: Response, next: NextFunction) {
  await authService
    .logoutUser(req.cookies.refreshToken, req.ip, res)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  await authService
    .refreshRefreshToken(req.cookies.refreshToken, req.ip)
    .then(({ refreshToken, ...user }) => {
      authService.setRefreshTokenCookie(res, refreshToken);
      res.status(200).send(user);
    })
    .catch((err) => next(err));
}
