import { Request, Response, NextFunction } from "express";

import { NotFoundError, UnauthorizedError } from "../../types/httperrors";
import { UserModel } from "../../models/User";
import { verifyJWT } from "../index";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.headers.authorization) {
    next(
      new UnauthorizedError({
        errorMessage: "Missing authorization",
        errorCode: "error_unauthorized",
      })
    );
  }

  const decodedJWT = verifyJWT(req.headers.authorization.slice(7));

  const user = await UserModel.findById(decodedJWT.id).then();

  if (!user) {
    next(new NotFoundError({ errorCode: "error_user_not_found" }));
  }

  req.user = user;
  next();
};
