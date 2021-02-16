import axios from "axios";

import config from "../config";
import Logger from "../loaders/logger";
import { CTFModel, ICTF } from "../models/CTF";
import { IUser } from "../models/User";
import { ITeam } from "../models/Team";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "../types/httperrors";
import { CTFOptions } from "../types";

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
   * @param {IUser} user the user performing the action
   * @param {ITeam} team the team
   * @param {CTFOptions} options any options for the CTF
   * @return {Promise<ICTF>} the CTF
   * @memberof CTFService
   */
  public async createCTF(
    user: IUser,
    team: ITeam,
    options: CTFOptions
  ): Promise<ICTF> {
    user = await user.populate("teams").execPopulate();

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
   * @param {IUser} user the user performing the action
   * @param {ITeam} team the team that the CTFs belong to
   * @return {Promise<Array<ICTF>>} an array of the CTFs
   * @memberof CTFService
   */
  public async listCTFs(
    user: IUser,
    team: ITeam,
    includeArchived?: boolean
  ): Promise<Array<ICTF>> {
    user = await user.populate("teams").execPopulate();
    team = await team.populate("CTFs").execPopulate();

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
      team.CTFs.filter((ctf) => !ctf.archived);
    }

    return team.CTFs;
  }

  /**
   * get a spesific CTF
   *
   * @param {IUser} user the user performing the action
   * @param {ITeam} team the team that the CTF belongs to
   * @param {string} ctfID the CTF to find
   * @return {Promise<ICTF>} the CTF it found
   * @memberof CTFService
   */
  public async getCTF(user: IUser, team: ITeam, ctfID: string): Promise<ICTF> {
    user = await user.populate("teams").execPopulate();
    team = await team.populate("CTFs").execPopulate();

    const ctf = await CTFModel.findById(ctfID).then();

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
   * @param {IUser} user the user performing the action
   * @param {ITeam} team the ID of the team that the CTF belongs to
   * @param {string} ctfID the CTF to archive
   * @return {Promise<ICTF>} the CTF after archival
   * @memberof CTFService
   */
  public async archiveCTF(
    user: IUser,
    team: ITeam,
    ctfID: string
  ): Promise<ICTF> {
    user = await user.populate("teams").execPopulate();
    team = await team.populate("CTFs").execPopulate();

    const ctf = await CTFModel.findById(ctfID).then();

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
   * @param {IUser} user the user performing the action
   * @param {ITeam} team the team that the CTF belongs to
   * @param {string} ctfID the CTF to unarchive
   * @return {Promise<ICTF>} the CTF after unarchival
   * @memberof CTFService
   */
  public async unarchiveCTF(
    user: IUser,
    team: ITeam,
    ctfID: string
  ): Promise<ICTF> {
    user = await user.populate("teams").execPopulate();
    team = await team.populate("CTFs").execPopulate();
    const ctf = await CTFModel.findById(ctfID).then();

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
