import { Request, Response, NextFunction } from "express";

import { BasicInvite, BasicUserDetails, JWTData } from "../types";
import { NotImplementedError, BadRequestError } from "../types/httperrors";
import { IUserModel } from "../models/User";
import { ITeamInviteModel } from "../models/TeamInvite";
import config from "../config";
import jsonWebToken from "jsonwebtoken";
import Logger from "../loaders/logger";

/**
 * maps a user document to a safer format without any sensitive details
 *
 * @private
 * @param {IUserModel} user the user that is used
 * @returns {BasicUserDetails} the user details with all sensitive details stripped
 */
function basicDetails(user: IUserModel): BasicUserDetails {
  const { id, username, usernameCapitalization, isAdmin } = user;
  return { id, username, usernameCapitalization, isAdmin };
}

function basicInvite(invite: ITeamInviteModel): BasicInvite {
  const { inviteCode, createdByUser, team } = invite;
  const userID = createdByUser._id;
  const teamID = team._id;
  return { inviteCode, createdByUser: userID, team: teamID };
}

const notImplemented = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotImplementedError());
};

function verifyJWT(jwt: string): JWTData {
  /* eslint-disable-next-line */
  let decodedJWT: string | object;
  try {
    decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
  } catch {
    Logger.verbose("Invalid JWT");
    throw new BadRequestError({
      errorMessage: "Invalid JWT",
      errorCode: "error_jwt_invalid",
    });
  }
  return decodedJWT as JWTData;
}

export { basicDetails, basicInvite, notImplemented, verifyJWT };
