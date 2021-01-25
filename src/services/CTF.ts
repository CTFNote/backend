import axios from "axios";

import config from "../config";
import Logger from "../loaders/logger";
import { CTFModel, ICTF } from "../models/CTF";
import { IUser, UserModel } from "../models/User";
import { ITeam, TeamModel } from "../models/Team";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "../types/httperrors";
import { CTFOptions } from "../types";
import { verifyJWT } from "../util";

export default class CTFService {
  private _hedgeDocAPI = axios.create({
    baseURL: config.get("hedgeDoc.baseURL"),
    timeout: config.get("hedgeDoc.timeout"),
  });

  /**
   * create a new HedgeDoc note
   *
   * @private
   * @param {string} noteName the title of the note
   * @return {Promise<string>} returns the URL of the new note (including any leading slashes)
   * @memberof CTFService
   */
  private async createNote(noteName: string): Promise<string> {
    return await this._hedgeDocAPI
      .post("/new", `${noteName}\n${"=".repeat(noteName.length)}`, {
        headers: { "Content-Type": "text/markdown" },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400, // Accept responses in the 200-399 range
      })
      .then((response) => {
        return response.headers.location;
      })
      .catch((_) => {
        Logger.warn("Request response code outside acceptable range.");
        throw new InternalServerError();
      });
  }

  /**
   * create a new CTF
   *
   * @param {string} jwt the JWT of the user performing the action
   * @param {string} teamID the ID of the team
   * @param {CTFOptions} options any options for the CTF
   * @return {Promise<ICTF>} the CTF
   * @memberof CTFService
   */
  public async createCTF(
    jwt: string,
    teamID: string,
    options: CTFOptions
  ): Promise<ICTF> {
    const decodedJWT = verifyJWT(jwt);

    let user: IUser;
    let team: ITeam;

    Logger.silly("Getting user and team");
    await Promise.all([
      UserModel.findById(decodedJWT.id),
      TeamModel.findById(teamID),
    ])
      .then(async (results) => {
        user = await results[0].populate("teams").execPopulate();
        team = results[1];
      })
      .catch((err) => {
        Logger.verbose(err);
        throw new InternalServerError();
      });

    if (!user) {
      Logger.verbose("User not found");
      throw new NotFoundError({ errorCode: "error_user_not_found" });
    }

    if (!team) {
      Logger.verbose("Team not found");
      throw new NotFoundError({ errorCode: "error_team_not_found" });
    }

    if (!team.members.includes(user.id) && !team.isOwner(user)) {
      Logger.verbose("User not in team");
      throw new ForbiddenError({
        errorCode: "error_user_not_in_team",
        errorMessage: "User is not in requested team",
        details: "User cannot create CTF for a team they are not a member of",
      });
    }

    console.log(this._hedgeDocAPI);

    Logger.silly("Creating notepad");
    const notepad = await this.createNote(options.name);

    Logger.silly("Creating CTF");
    let ctf = new CTFModel({
      notepad: notepad.slice(1),
      challenges: [],
      team: team.id,
    });

    ctf = await ctf.save();

    team.CTFs.push(ctf.id);
    team.save();

    return ctf;
  }

  /**
   * list all CTFs for a team
   *
   * @param {string} jwt the user's JWT
   * @param {string} teamID the ID of the team that the CTFs belong to
   * @return {Promise<Array<ICTF>>} an array of the CTFs
   * @memberof CTFService
   */
  public async listCTFs(jwt: string, teamID: string, includeArchived?: boolean): Promise<Array<ICTF>> {
    const decodedJWT = verifyJWT(jwt);

    let user: IUser;
    let team: ITeam;

    Logger.silly("Getting user and team");
    await Promise.all([
      UserModel.findById(decodedJWT.id),
      TeamModel.findById(teamID),
    ])
      .then(async (results) => {
        user = await results[0].populate("teams").execPopulate();
        team = await results[1].populate("CTFs").execPopulate();
      })
      .catch((err) => {
        Logger.verbose(err);
        throw new InternalServerError();
      });

    if (!user) {
      Logger.verbose("User not found");
      throw new NotFoundError({ errorCode: "error_user_not_found" });
    }

    if (!team) {
      Logger.verbose("Team not found");
      throw new NotFoundError({ errorCode: "error_team_not_found" });
    }

    if (
      !(team.members.includes(user.id) || team.isOwner(user)) &&
      !user.isAdmin
    ) {
      Logger.verbose("Invalid permissions");
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
      });
    }

    if (!includeArchived) {
      team.CTFs.filter(ctf => !ctf.archived);
    }

    return team.CTFs;
  }

  /**
   * get a spesific CTF
   *
   * @param {string} jwt the user's JWT
   * @param {string} teamID the ID of the team that the CTF belongs to
   * @param {string} ctfID the CTF to find
   * @return {Promise<ICTF>} the CTF it found
   * @memberof CTFService
   */
  public async getCTF(
    jwt: string,
    teamID: string,
    ctfID: string
  ): Promise<ICTF> {
    const decodedJWT = verifyJWT(jwt);

    let user: IUser;
    let team: ITeam;
    let ctf: ICTF;

    Logger.silly("Getting user, team, and CTF");
    await Promise.all([
      UserModel.findById(decodedJWT.id),
      TeamModel.findById(teamID),
      CTFModel.findById(ctfID),
    ])
      .then(async (results) => {
        user = await results[0].populate("teams").execPopulate();
        team = await results[1].populate("CTFs").execPopulate();
        ctf = results[2];
      })
      .catch((err) => {
        Logger.verbose(err);
        throw new InternalServerError();
      });

    if (!user) {
      Logger.verbose("User not found");
      throw new NotFoundError({ errorCode: "error_user_not_found" });
    }

    if (!team) {
      Logger.verbose("Team not found");
      throw new NotFoundError({ errorCode: "error_team_not_found" });
    }

    if (!ctf) {
      Logger.verbose("CTF not found");
      throw new NotFoundError({ errorCode: "error_ctf_not_found" });
    }

    if (ctf.team !== team.id && !user.isAdmin) {
      Logger.verbose("Invalid permissions");
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
      });
    }

    if (
      !(team.members.includes(user.id) || team.isOwner(user)) &&
      !user.isAdmin
    ) {
      Logger.verbose("Invalid permissions");
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
      });
    }

    return ctf;
  }

  /**
   * Archives a CTF
   *
   * @param {string} jwt the JWT of the user
   * @param {string} teamID the ID of the team that the CTF belongs to
   * @param {string} ctfID the CTF to archive
   * @return {Promise<ICTF>} the CTF after archival
   * @memberof CTFService
   */
  public async archiveCTF(jwt: string, teamID: string, ctfID: string): Promise<ICTF> {
    const decodedJWT = verifyJWT(jwt);

    let user: IUser;
    let team: ITeam;
    let ctf: ICTF;

    Logger.silly("Getting user, team, and CTF");
    await Promise.all([
      UserModel.findById(decodedJWT.id),
      TeamModel.findById(teamID),
      CTFModel.findById(ctfID),
    ])
      .then(async (results) => {
        user = await results[0].populate("teams").execPopulate();
        team = await results[1].populate("CTFs").execPopulate();
        ctf = results[2];
      })
      .catch((err) => {
        Logger.verbose(err);
        throw new InternalServerError();
      });

    if (!user) {
      Logger.verbose("User not found");
      throw new NotFoundError({ errorCode: "error_user_not_found" });
    }

    if (!team) {
      Logger.verbose("Team not found");
      throw new NotFoundError({ errorCode: "error_team_not_found" });
    }

    if (!ctf) {
      Logger.verbose("CTF not found");
      throw new NotFoundError({ errorCode: "error_ctf_not_found" });
    }

    if (ctf.team !== team.id && !user.isAdmin) {
      Logger.verbose("Invalid permissions");
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
      });
    }

    if (
      !(team.members.includes(user.id) || team.isOwner(user)) &&
      !user.isAdmin
    ) {
      Logger.verbose("Invalid permissions");
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
      });
    }

    ctf.archived = true;

    await ctf.save();

    return ctf;
  }

  /**
   * Unrchives a CTF
   *
   * @param {string} jwt the JWT of the user
   * @param {string} teamID the ID of the team that the CTF belongs to
   * @param {string} ctfID the CTF to unarchive
   * @return {Promise<ICTF>} the CTF after unarchival
   * @memberof CTFService
   */
  public async unarchiveCTF(jwt: string, teamID: string, ctfID: string): Promise<ICTF> {
    const decodedJWT = verifyJWT(jwt);

    let user: IUser;
    let team: ITeam;
    let ctf: ICTF;

    Logger.silly("Getting user, team, and CTF");
    await Promise.all([
      UserModel.findById(decodedJWT.id),
      TeamModel.findById(teamID),
      CTFModel.findById(ctfID),
    ])
      .then(async (results) => {
        user = await results[0].populate("teams").execPopulate();
        team = await results[1].populate("CTFs").execPopulate();
        ctf = results[2];
      })
      .catch((err) => {
        Logger.verbose(err);
        throw new InternalServerError();
      });

    if (!user) {
      Logger.verbose("User not found");
      throw new NotFoundError({ errorCode: "error_user_not_found" });
    }

    if (!team) {
      Logger.verbose("Team not found");
      throw new NotFoundError({ errorCode: "error_team_not_found" });
    }

    if (!ctf) {
      Logger.verbose("CTF not found");
      throw new NotFoundError({ errorCode: "error_ctf_not_found" });
    }

    if (ctf.team !== team.id && !user.isAdmin) {
      Logger.verbose("Invalid permissions");
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
      });
    }

    if (
      !(team.members.includes(user.id) || team.isOwner(user)) &&
      !user.isAdmin
    ) {
      Logger.verbose("Invalid permissions");
      throw new ForbiddenError({
        errorCode: "error_invalid_permissions",
      });
    }

    ctf.archived = false;

    await ctf.save();

    return ctf;
  }
}
