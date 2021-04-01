import { NextFunction, Request, Response } from "express";
import { CTFModel } from "../../models/CTF";

import { Middleware } from "../../types";
import { InternalServerError, NotFoundError } from "../../types/httperrors";


export default (): Middleware => {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const ctf = await CTFModel.findById(req.params.ctfID)
      .then()
      .catch(() => next(new InternalServerError()));

    if (!ctf) {
      return next(new NotFoundError({ errorCode: "error_ctf_not_found" }));
    }

    req.ctf = ctf;
    return next();
  };
};
