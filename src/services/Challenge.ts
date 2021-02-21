import axios from "axios";

import config from "../config";
import Logger from "../loaders/logger";
import { IChallenge, ChallengeModel } from "../models/Challenge";
import { ICTF } from "../models/CTF";
import { ITeam } from "../models/Team";
import { IUser } from "../models/User";
import { ChallengeOptions } from "../types";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "../types/httperrors";

export default class Challenge {
  private _hedgeDocAPI = axios.create({
    baseURL: config.get("hedgeDoc.baseURL"),
    timeout: config.get("hedgeDoc.timeout"),
  });

  /**
   * Creates a new challenge in a CTF
   *
   * @param {IUser} user the user performing the action
   * @param {ITeam} team the team the user is using
   * @param {ICTF} ctf the CTF the challenge should be created on
   * @param {ChallengeOptions} challengeOptions options for the challenge, like points value and name
   * @return {Promise<IChallenge>} returns the challenge that was created
   * @memberof Challenge
   */
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
   * Gets a spesific challenge
   *
   * @param {IUser} user the user performing the action
   * @param {ITeam} team the team the user is using
   * @param {ICTF} ctf the CTF the challenge belongs on
   * @param {string} challengeID the challenge to return
   * @return {Promise<IChallenge>} the challenge itself
   * @memberof Challenge
   */
  public async getChallenge(
    user: IUser,
    team: ITeam,
    ctf: ICTF,
    challengeID: string
  ): Promise<IChallenge> {
    Logger.verbose(
      `ChallengeService >>> Getting challenge with ID ${challengeID} from CTF ${ctf._id}`
    );

    const challenge = await ChallengeModel.findById(challengeID).then();

    if (!team.inTeam(user) || user.isAdmin) {
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
        errorMessage:
          "Cannot get challenge from team where you are not a member.",
        details:
          "Only people who are in a team (or is an admin) can get challenges from CTFs of that team",
      });
    }

    if (!ctf.challenges.includes(challenge._id)) {
      throw new NotFoundError({
        errorCode: "error_challenge_not_found",
        errorMessage: "Challenge not found on specified CTF",
      });
    }

    return challenge;
  }

  /**
   * create a new HedgeDoc note
   *
   * @private
   * @param {string} noteName the title of the note
   * @param {string} pointsValue how many points the challenge is worth
   * @return {Promise<string>} returns the URL of the new note (including any leading slashes)
   * @memberof Challenge
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
