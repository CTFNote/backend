import jsonWebToken from "jsonwebtoken";

import config from "../config";
import { UserModel } from "../models/User";
import { JWTData, UserDetailsUpdateData } from "../types";
import { BadRequestError } from "../types/httperrors";

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
}
