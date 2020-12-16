import { BasicInvite, BasicUserDetails } from "../types";
import { IUserModel } from "../models/User";
import { ITeamInviteModel } from "../models/TeamInvite";

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

export { basicDetails, basicInvite };
