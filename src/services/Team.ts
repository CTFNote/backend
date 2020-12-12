import jsonWebToken from "jsonwebtoken";

import { TeamModel } from "../models/Team";
import { UserModel } from "../models/User";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
} from "../types/httperrors";
import { JWTData } from "../types";
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

    const teamExists = await TeamModel.exists({ name: teamName.toLowerCase() }).then();

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
      creator: owner,
      members: undefined,
      socials: undefined,
      CTFs: undefined,
    }).catch((err) => {
      Logger.error(`Error while creating team: ${err}`);
      throw new InternalServerError();
    });

    team.save();

    return { teamName: team.name, teamID: team._id };
  }
}
