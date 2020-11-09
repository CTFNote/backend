import { NextFunction, Request, Response, Router } from "express";

import UserService from "../../services/user";

const userService = new UserService();

export default (): Router => {
  const router = Router();

  router.post("/register", register);
  router.post("/login", login);
  router.post("/logout", logout);
  router.post("/refresh-token", refreshToken);

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
    .revokeToken(req.cookies.refreshToken, req.ip)
    .then((_) => {
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
