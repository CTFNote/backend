import axios from "axios";

import config from "../config";
import Logger from "../loaders/logger";
import { IChallenge, ChallengeModel } from "../models/Challenge";
import { ICTF } from "../models/CTF";
import { ITeam } from "../models/Team";
import { IUser } from "../models/User";
import { ChallengeOptions } from "../types";
import { ForbiddenError, InternalServerError } from "../types/httperrors";

export default class Challenge {
  private _hedgeDocAPI = axios.create({
    baseURL: config.get("hedgeDoc.baseURL"),
    timeout: config.get("hedgeDoc.timeout"),
  });

  public async createChallenge(
    user: IUser,
    team: ITeam,
    ctf: ICTF,
    challengeOptions: ChallengeOptions
  ): Promise<IChallenge> {
    Logger.verbose(
      `ChallengeService >>> Creating new challenge in CTF "${team._id}"`
    );

    if (!team.inTeam(user) && !user.isAdmin) {
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
        errorMessage: "You either are not in this team or not an admin.",
        details:
          "Only people who are in a team (or is an admin) can create challenges",
      });
    }

    const notepad = await this.createNote(
      challengeOptions.name,
      challengeOptions.points
    );

    const challenge = new ChallengeModel({
      notepad: notepad.slice(1),
      points: challengeOptions.points,
      solved: false,
    });

    await challenge.save();

    ctf.challenges.push(challenge);
    await ctf.save();

    return challenge;
  }

  /**
   * create a new HedgeDoc note
   *
   * @private
   * @param {string} noteName the title of the note
   * @param {string} pointsValue how many points the challenge is worth
   * @return {Promise<string>} returns the URL of the new note (including any leading slashes)
   * @memberof CTFService
   */
  private async createNote(
    noteName: string,
    pointsValue: string
  ): Promise<string> {
    return await this._hedgeDocAPI
      .post(
        "/new",
        `${noteName}\n${"=".repeat(
          noteName.length
        )}\n|Points|\n----\n${pointsValue}`,
        {
          headers: { "Content-Type": "text/markdown" },
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400, // Accept responses in the 200-399 range
        }
      )
      .then((response) => {
        return response.headers.location;
      })
      .catch((_) => {
        Logger.warn("Request response code outside acceptable range.");
        throw new InternalServerError();
      });
  }
}