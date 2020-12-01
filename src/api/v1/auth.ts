import { celebrate, Joi, Segments } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";

import UserService from "../../services/user";

const userService = new UserService();

const verifyCredentials = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
  }),
});

export default (): Router => {
  const router = Router();

  router.post("/register", verifyCredentials, register);
  router.post("/login", verifyCredentials, login);
  router.post(
    "/logout",
    celebrate({
      [Segments.COOKIES]: Joi.object({
        refreshToken: Joi.string().length(128),
      }),
    }),
    logout
  );
  router.post(
    "/refresh-token",
    celebrate({
      [Segments.COOKIES]: Joi.object({
        refreshToken: Joi.string().length(128).required(),
      }),
    }),
    refreshToken
  );

  return router;
};

async function register(req: Request, res: Response, next: NextFunction) {
  await userService
    .registerUser(req.body.username, req.body.password, req.ip)
    .then(({ refreshToken, ...user }) => {
      userService.setRefreshTokenCookie(res, refreshToken);
      res.status(201).send(user);
    })
    .catch((err) => next(err));
}

async function login(req: Request, res: Response, next: NextFunction) {
  await userService
    .authenticateUser(req.body.username, req.body.password, req.ip)
    .then(({ refreshToken, ...user }) => {
      userService.setRefreshTokenCookie(res, refreshToken);
      res.status(200).send(user);
    })
    .catch((err) => next(err));
}

async function logout(req: Request, res: Response, next: NextFunction) {
  await userService
    .logoutUser(req.cookies.refreshToken, req.ip, res)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  await userService
    .refreshRefreshToken(req.cookies.refreshToken, req.ip)
    .then(({ refreshToken, ...user }) => {
      userService.setRefreshTokenCookie(res, refreshToken);
      res.status(200).send(user);
    })
    .catch((err) => next(err));
}
