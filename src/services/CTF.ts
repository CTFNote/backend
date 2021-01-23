import axios from "axios";

import config from "../config";
import Logger from "../loaders/logger";
import { InternalServerError } from "../types/httperrors";

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
      })
      .then((response) => {
        return response.headers.location;
      })
      .catch((error) => {
        Logger.warn(error);
        throw new InternalServerError();
      });
  }
}
