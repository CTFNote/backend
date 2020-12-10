import { BasicUserDetails } from "../types";
import { IUserModel } from "../models/User";

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

export { basicDetails };
