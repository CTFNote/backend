import { Request, Response, NextFunction } from "express";

import { NotFoundError, UnauthorizedError } from "../../types/httperrors";
import { UserModel } from "../../models/User";
import { verifyJWT } from "../index";
import { Middleware } from "../../types";

export default (options?: { userOptional?: boolean }): Middleware => {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.headers.authorization && !options?.userOptional) {
      next(
        new UnauthorizedError({
          errorMessage: "Missing authorization",
          errorCode: "error_unauthorized",
        })
      );
    }

    const decodedJWT = verifyJWT(req.headers.authorization.slice(7));

    const user = await UserModel.findById(decodedJWT.id).then();

    if (!user && !options?.userOptional) {
      next(new NotFoundError({ errorCode: "error_user_not_found" }));
    }

    req.user = user;
    return next();
  };
};
