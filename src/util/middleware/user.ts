import { Request, Response, NextFunction } from "express";
import { CelebrateError, Joi, Segments } from "celebrate";

import { NotFoundError, UnauthorizedError } from "../../types/httperrors";
import { UserModel } from "../../models/User";
import { verifyJWT } from "../index";
import { JWTData, Middleware } from "../../types";
import { mongoDbObjectId } from "../celebrate";

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

    let decodedJWT: JWTData;
    try {
      decodedJWT = verifyJWT(req.headers.authorization.slice(7));
    } catch (err) {
      return next(err);
    }

    const validation = Joi.object({ userID: mongoDbObjectId }).validate({
      userID: decodedJWT.id,
    });

    if (validation.error) {
      const error = new CelebrateError(undefined, { celebrated: true });
      error.details.set(Segments.PARAMS, validation.error);
      return next(error);
    }

    const user = await UserModel.findById(decodedJWT.id).then();

    if (!user && !options?.userOptional) {
      next(new NotFoundError({ errorCode: "error_user_not_found" }));
    }

    req.user = user;
    return next();
  };
};
