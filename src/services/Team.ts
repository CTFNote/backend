import jsonWebToken from "jsonwebtoken";

import { TeamModel, ITeamModel } from "../models/Team";
import { IUserModel, UserModel } from "../models/User";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from "../types/httperrors";
import { JWTData, TeamDetailsUpdateData } from "../types";
import config from "../config";
import Logger from "../loaders/logger";

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
}
