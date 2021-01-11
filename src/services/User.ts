import { UserModel } from "../models/User";
import { BasicUserDetails, UserDetailsUpdateData } from "../types";
import { BadRequestError, ForbiddenError } from "../types/httperrors";
import { basicDetails, verifyJWT } from "../util";
import Logger from "../loaders/logger";

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
    Logger.verbose("Updating user details");
    const decodedJWT = verifyJWT(jwt);

    const user = await UserModel.findById(decodedJWT.id).then();
    Logger.debug(user);

    if (userDetails.username) {
      Logger.silly("Updating username");
      if (
        await UserModel.findOne({
          username: userDetails.username.toLowerCase(),
        }).then()
      ) {
        Logger.verbose("Username already taken");
        throw new BadRequestError({
          errorMessage: "Username is taken",
          errorCode: "error_user_exists",
        });
      }
      user.username = userDetails.username;
      user.usernameCapitalization = userDetails.username.toLowerCase();
    }

    if (userDetails.capitalization) {
      Logger.silly("Updating username capitalization");
      if (
        userDetails.capitalization.toLowerCase() !== user.username.toLowerCase()
      ) {
        Logger.verbose(
          "Invalid username capitalization (usernames don't match)"
        );
        throw new BadRequestError({
          errorMessage: "Capitalization and username must match",
          errorCode: "error_invalid_username",
        });
      }
      user.usernameCapitalization = userDetails.capitalization;
    }

    Logger.debug("Saving new user");
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
    Logger.verbose("Getting user details");
    /* eslint-disable-next-line */
    const decodedJWT = verifyJWT(jwt);

    let userID = decodedJWT.id;

    if (options?.user) {
      if (decodedJWT.isAdmin) {
        Logger.verbose("User is admin");
        userID = options.user;
      } else {
        Logger.info(
          "User tried to access info on other user without admin perms"
        );
        throw new ForbiddenError({
          errorMessage: "You do not have access to this user",
          errorCode: "error_forbidden",
        });
      }
    }

    const user = await UserModel.findById(userID).then();

    if (!user) {
      return;
    }

    Logger.silly("Returning basic user details");
    return basicDetails(user);
  }
}
