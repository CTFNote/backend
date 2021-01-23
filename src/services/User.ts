import { IUser, UserModel } from "../models/User";
import { BasicUserDetails, UserDetailsUpdateData } from "../types";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../types/httperrors";
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
    if (!user) {
      Logger.verbose("User not found");
      throw new NotFoundError({ errorCode: "error_user_not_found" });
    }
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

  /**
   * deletes a user from the DB and removes the user from all teams
   *
   * @param {string} jwt the JWT of the user performing the request
   * @param {{ user: string }} [options] a user to delete. only works for admins
   * @return {Promise<void>} doesn't return anything
   * @memberof UserService
   */
  public async deleteUser(
    jwt: string,
    options?: { user: string }
  ): Promise<void> {
    const decodedJWT = verifyJWT(jwt);

    let user = await UserModel.findById(decodedJWT.id);

    let deleteUser: IUser;

    if (options?.user) {
      if (!user.isAdmin) {
        throw new ForbiddenError({
          errorCode: "error_invalid_permissions",
          errorMessage: "You do not have permissions to delete this user",
        });
      }
      deleteUser = await (
        await UserModel.findById(options.user).populate("teams")
      ).execPopulate();
    } else {
      user = await user.populate("teams").execPopulate();
    }

    if (deleteUser) {
      for (const team of deleteUser.teams) {
        if (team.isOwner(deleteUser)) {
          throw new BadRequestError({
            errorCode: "error_user_owner",
            errorMessage:
              "The user is owner of one or more teams. Change the owner for all teams before deleting",
          });
        }

        team.members.filter((user) => user.id !== deleteUser.id);
        team.save();
      }

      await deleteUser.save();
    } else {
      for (const team of deleteUser.teams) {
        if (team.isOwner(deleteUser)) {
          throw new BadRequestError({
            errorCode: "error_user_owner",
            errorMessage:
              "The user is owner of one or more teams. Change the owner for all teams before deleting",
          });
        }

        team.members.filter((user) => user.id !== deleteUser.id);
        team.save();
      }

      await user.delete();
    }
  }
}
