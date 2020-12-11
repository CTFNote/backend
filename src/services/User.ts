import jsonWebToken from "jsonwebtoken";

import config from "../config";
import { UserModel } from "../models/User";
import { BasicUserDetails, JWTData, UserDetailsUpdateData } from "../types";
import { BadRequestError, ForbiddenError } from "../types/httperrors";
import { basicDetails } from "../util";

export default class UserService {
  /**
   * update user details (change username, update password, etc)
   *
   * @param {string} jwt the JWT used for auth
   * @param {UserDetailsUpdateData} userDetails the data to update
   * @memberof UserService
   */
  public async updateDetails(
    jwt: string,
    userDetails: UserDetailsUpdateData
  ): Promise<void> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    const user = await UserModel.findById((decodedJWT as JWTData).id).then();

    if (userDetails.username) {
      if (
        await UserModel.findOne({
          username: userDetails.username.toLowerCase(),
        }).then()
      ) {
        throw new BadRequestError();
      }
      user.username = userDetails.username;
      user.usernameCapitalization = userDetails.username.toLowerCase();
    }

    if (userDetails.capitalization) {
      if (
        userDetails.capitalization.toLowerCase() !== user.username.toLowerCase()
      ) {
        throw new BadRequestError();
      }
      user.usernameCapitalization = userDetails.capitalization;
    }

    user.save();
  }

  /**
   * get user details
   *
   * @param {string} jwt the JWT used for auth
   * @memberof UserService
   */
  public async getDetails(
    jwt: string,
    options?: { user: string }
  ): Promise<BasicUserDetails> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    let userID = (decodedJWT as JWTData).id;

    if (options?.user) {
      if ((decodedJWT as JWTData).isAdmin) {
        userID = options.user;
      } else {
        throw new ForbiddenError();
      }
    }

    const user = await UserModel.findById(userID).then();

    if (!user) {
      return;
    }

    return basicDetails(user);
  }
}
