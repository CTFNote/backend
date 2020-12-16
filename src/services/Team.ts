import { randomBytes } from "crypto";
import jsonWebToken from "jsonwebtoken";

import { TeamModel, ITeamModel } from "../models/Team";
import { IUserModel, UserModel } from "../models/User";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../types/httperrors";
import { BasicInvite, InviteOptions, JWTData, TeamDetailsUpdateData } from "../types";
import config from "../config";
import Logger from "../loaders/logger";
import { ITeamInviteModel, TeamInviteModel } from "../models/TeamInvite";
import { basicInvite } from "../util";

export default class TeamService {
  /**
   * createTeam
   */
  public async createTeam(
    jwt: string,
    teamName: string
  ): Promise<{ teamName: string; teamID: string }> {
    // TODO: Turn this into a proper type

    const teamExists = await TeamModel.exists({
      name: teamName.toLowerCase(),
    }).then();

    if (teamExists) throw new ConflictError({ errorCode: "error_team_exists" });

    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    const owner = await UserModel.findById((decodedJWT as JWTData).id).then();

    const team = await TeamModel.create({
      name: teamName.toLowerCase(),
      owner,
      members: undefined,
      socials: undefined,
      CTFs: undefined,
      invites: [],
    }).catch((err) => {
      Logger.error(`Error while creating team: ${err}`);
      throw new InternalServerError();
    });

    owner.teams.push(team);

    team.save();
    owner.save();

    return { teamName: team.name, teamID: team._id };
  }

  /**
   * Get's a team's information. By default only allows to get info if the user is in the team, but admins can always get the team details
   *
   * @async
   * @param {string} jwt the JWT of the user trying to get team details
   * @param {string} teamID the ID of the team that is getting fetched
   * @memberof TeamService
   */
  public async getTeam(jwt: string, teamID: string): Promise<ITeamModel> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    const user = await (await UserModel.findById((decodedJWT as JWTData).id))
      .execPopulate()
      .then()
      .catch((err) => {
        Logger.error(err);
        throw new InternalServerError();
      });

    let team: ITeamModel;
    if (teamID in user.teams) {
      team = await TeamModel.findById(teamID);
    } else if ((decodedJWT as JWTData).isAdmin) {
      team = await TeamModel.findById(teamID);
    } else {
      throw new UnauthorizedError();
    }

    return team;
  }

  /**
   * async updateTeam
   */
  public async updateTeam(
    jwt: string,
    teamID: string,
    newDetails: TeamDetailsUpdateData
  ): Promise<ITeamModel> {
    const team = await this.getTeam(jwt, teamID);

    if (newDetails.name) team.name = newDetails.name;

    if (newDetails.socials?.twitter)
      team.socials.twitter = newDetails.socials.twitter;

    if (newDetails.socials?.website)
      team.socials.website = newDetails.socials.twitter;

    await team.save().catch((err) => {
      Logger.warn(err);
      throw new InternalServerError();
    });

    return team;
  }

  /**
   * async updateOwner
   */
  public async updateOwner(
    jwt: string,
    teamID: string,
    newOwnerID: string
  ): Promise<ITeamModel> {
    let team: ITeamModel;
    let oldOwner: IUserModel;
    let newOwner: IUserModel;

    await Promise.all([
      this.getTeam(jwt, teamID),
      UserModel.findById((jsonWebToken.decode(jwt) as JWTData).id),
      UserModel.findById(newOwnerID),
    ])
      .then(async (results) => {
        console.log(results);

        team = await results[0]
          .populate("owner")
          .populate("members")
          // .populate("CTFs")
          .execPopulate();
        oldOwner = await results[1].populate("teams").execPopulate();
        newOwner = await results[2].populate("teams").execPopulate();
      })
      .catch((err) => {
        throw err;
      });

    const decodedJWT = jsonWebToken.decode(jwt) as JWTData;

    if (!decodedJWT.isAdmin) {
      if (!(newOwner._id in team.members)) {
        throw new BadRequestError({
          message: "New owner must be in team before transfer of ownership",
        });
      }

      if (!(oldOwner === team.owner)) {
        throw new BadRequestError({
          message: "Cannot transfer ownership",
          errorCode: "error_user_not_owner",
        });
      }
    }
    team.owner = newOwner;
    await team.save();

    await team.depopulate("owner").depopulate("members").execPopulate();

    return team;
  }

  /**
   * async createInvite
   */
  public async createInvite(
    jwt: string,
    teamID: string,
    inviteOptions: InviteOptions
  ): Promise<ITeamInviteModel> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    let user: IUserModel;
    let team: ITeamModel;
    await Promise.all([
      UserModel.findById((decodedJWT as JWTData).id),
      TeamModel.findById(teamID),
    ])
      .then((results) => {
        user = results[0];
        team = results[1];
      })
      .catch((err) => {
        throw err;
      });

    if (!user.isAdmin) {
      if (!(user._id === team.owner)) {
        throw new BadRequestError({
          message: "Only the team owner can create invites",
          errorCode: "error_invalid_permissions",
        });
      }
    }

    const invite = new TeamInviteModel({
      team: team._id,
      inviteCode: randomBytes(3).toString("hex"),
      expiry: inviteOptions.expiry ? inviteOptions.expiry : undefined,
      maxUses: inviteOptions.maxUses ? inviteOptions.maxUses : undefined,
      createdAt: new Date(),
      createdByUser: user._id,
      uses: [],
    });

    if (!team.invites) {
      team.invites = [];
    }

    team.invites.push(invite._id);

    await invite.save();
    await team.save();

    return invite;
  }

  /**
   * async getInvite
   */
  public async getInvite(
    jwt: string | undefined,
    inviteID: string
  ): Promise<ITeamInviteModel | BasicInvite> {
    const invite = await TeamInviteModel.findOne({ inviteCode: inviteID });

    let user: IUserModel;
    if (jwt) {
      /* eslint-disable-next-line */
      let decodedJWT: string | object;
      try {
        decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
      } catch {
        throw new BadRequestError({ message: "Invalid JWT" });
      }

      user = await UserModel.findById((decodedJWT as JWTData).id);
    }

    if (!user?.isAdmin) {
      if (
        invite.uses.length >= invite.maxUses ||
        new Date() >= new Date(invite.expiry)
      ) {
        throw new BadRequestError({ errorCode: "error_expired_invite" });
      }

      return basicInvite(invite);
    }
    return invite;
  }

  public async deleteInvite(jwt: string, inviteID: string): Promise<void> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    const user = await UserModel.findById((decodedJWT as JWTData).id);
    const invite = await TeamInviteModel.findOne({ inviteCode: inviteID });

    if (!invite) {
      throw new NotFoundError({ message: "Invite not found" });
    }

    const team = invite.team;

    if (!user.isAdmin) {
      if (!(user === team.owner)) {
        throw new BadRequestError({ errorCode: "error_invalid_permissions" });
      }
    }

    await invite.delete();
  }

  /**
   * async useInvite
   */
  public async useInvite(jwt: string, inviteID: string): Promise<ITeamModel> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    const user = await UserModel.findById((decodedJWT as JWTData).id);
    const invite = await TeamInviteModel.findOne({ inviteCode: inviteID });

    if (!invite) throw new NotFoundError({ message: "Invite not found" });

    const team = invite.team;

    team.members.push(user._id);
    user.teams.push(team._id);
    invite.uses.push(user._id);

    Promise.all([team.save(), user.save(), invite.save()])
      .then()
      .catch((err) => {
        throw err;
      });

    return team;
  }

  public async leaveTeam(jwt: string, teamID: string): Promise<void> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    const user = await UserModel.findById((decodedJWT as JWTData).id);
    const team = await TeamModel.findById(teamID);

    if (team.owner === user)
      throw new ConflictError({
        message: "Owner may not leave team",
        details:
          "The owner of a team cannot leave it without first changing the owner to a different member",
      });

    if (!(user._id in team.members))
      throw new ConflictError({
        message: "Cannot leave team",
        errorCode: "error_not_in_team",
      });

    team.members = team.members.splice(team.members.indexOf(user._id), 1);
    user.teams = user.teams.splice(user.teams.indexOf(team._id), 1);

    team.save();
    user.save();

    return;
  }

  public async deleteTeam(jwt: string, teamID: string): Promise<void> {
    /* eslint-disable-next-line */
    let decodedJWT: string | object;
    try {
      decodedJWT = jsonWebToken.verify(jwt, config.get("jwt.secret"));
    } catch {
      throw new BadRequestError({ message: "Invalid JWT" });
    }

    const user = await UserModel.findById((decodedJWT as JWTData).id);
    const team = await TeamModel.findById(teamID);

    if (!user.isAdmin) {
      if (team.owner !== user._id)
        throw new BadRequestError({
          errorCode: "error_invalid_permissions",
          message: "Only the team owner can delete the team",
        });
    }

    user.teams = user.teams.splice(user.teams.indexOf(team._id), 1);

    for (const member of team.members) {
      member.teams = member.teams.splice(member.teams.indexOf(team._id), 1);
      member.save();
    }

    await user.save();
    await team.delete();

    return;
  }
}
