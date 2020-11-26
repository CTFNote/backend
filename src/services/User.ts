import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { CookieOptions, Response } from "express";

import config from "../config";
import Logger from "../loaders/logger";
import { IUserModel, UserModel } from "../models/User";
import RefreshToken, { IRefreshTokenModel } from "../models/RefreshToken";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../types/httperrors";

const saltRounds = config.get("saltRounds");

export default class UserService {
  /**
   * registers a new user to the database
   *
   * @param {string} username what username to use for registration
   * @param {string} password the password the user will use
   * @param {string} ipAddress the ip address used to register the user
   * @returns {object} an object containing the user details, access token and refresh token
   * @memberof UserService
   */
  public async registerUser(
    username: string,
    password: string,
    ipAddress: string
  ): Promise<{
    id: mongoose.Types.ObjectId;
    username: string;
    jwtToken: string;
    refreshToken: string;
  }> {
    const userAlreadyExists = await UserModel.findOne({
      username: username.toLowerCase(),
    }).then();

    if (userAlreadyExists)
      throw new ConflictError({ errorCode: "error_user_exists" });

    return bcrypt
      .hash(password, saltRounds)
      .then(async (hash) => {
        Logger.silly("Saving new user to the DB");
        const newUser = await new UserModel({
          username: username.toLowerCase(),
          password: hash,
          teams: [],
        }).save();
        return {
          ...this.basicDetails(newUser),
          ...(await this.generateTokens(newUser, ipAddress)),
        };
      })
      .catch((err) => {
        Logger.warn(`Error while registering new user: ${err}`);
        throw new InternalServerError();
      });
  }

  /**
   * authenticates a user for logging in
   *
   * @param {string} username username used to log in
   * @param {string} password password for logging in
   * @param {string} ipAddress ip address of the user logging in
   * @returns {object} an object containing the user details, access token and refresh token
   * @memberof UserService
   */
  public async authenticateUser(
    username: string,
    password: string,
    ipAddress: string
  ): Promise<{
    user: { id: mongoose.Types.ObjectId; username: string };
    jwtToken: string;
    refreshToken: string;
  }> {
    const user = await UserModel.findOne({ username: username.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new BadRequestError({
        errorCode: "error_invalid_credentials",
        details: "Username or password is incorrect",
      });

    return {
      user: this.basicDetails(user),
      ...(await this.generateTokens(user, ipAddress)),
    };
  }

  /**
   * generates the JWT and refresh tokens that will be returned to the user
   *
   * @private
   * @param {IUserModel} user what user the tokens should be generated for
   * @param {string} ipAddress what ip address is used to generate the tokens
   * @returns the jwt and refresh tokens
   * @memberof UserService
   */
  private async generateTokens(user: IUserModel, ipAddress: string) {
    const jwtToken = this.generateAccesstoken(user);
    const refreshToken = this.generateRefreshtoken(user, ipAddress);

    await refreshToken.save();

    return {
      jwtToken,
      refreshToken: refreshToken.token,
    };
  }

  /**
   * gets the basic details of a user. removes any sensitive information, such as password hashes
   *
   * @param {mongoose.Types.ObjectId} id the id of the user to find details on
   * @returns basic details of a user
   * @memberof UserService
   */
  public async getBasicUser(
    id: mongoose.Types.ObjectId
  ): Promise<{ id: string; username: string }> {
    return this.basicDetails(await this.getFullUser(id));
  }

  /**
   * gets all information on a user. this includes any and all sensitive information.
   *
   * @param {mongoose.Types.ObjectId} id the id of the user to find details on
   * @returns {Promise<IUserModel>} the whole document on the user
   * @memberof UserService
   */
  public async getFullUser(id: mongoose.Types.ObjectId): Promise<IUserModel> {
    if (!isValidObjectId(id))
      throw new BadRequestError({ errorCode: "error_invalid_id" });

    const user = await UserModel.findById(id).then();
    if (!user) throw new NotFoundError({ errorCode: "error_user_not_found" });
    return user;
  }

  /**
   * generates a new refresh token while revoking the old one
   *
   * @param {string} token the token to revoke
   * @param {string} ipAddress the ip adress that is refreshing the token
   * @returns user details along with a JWT and the new refresh token
   * @memberof UserService
   */
  public async refreshRefreshToken(
    token: string,
    ipAddress: string
  ): Promise<{
    id: mongoose.Types.ObjectId;
    username: string;
    jwtToken: string;
    refreshToken: string;
  }> {
    const refreshToken = (await this.getRefreshToken(token)).populate("User");
    const user = await this.getFullUser(refreshToken.user._id);

    const newRefreshToken = this.generateRefreshtoken(user, ipAddress);
    await this.revokeToken(token, ipAddress, newRefreshToken.token);
    await newRefreshToken.save();

    const jwtToken = this.generateAccesstoken(user);

    return {
      ...this.basicDetails(user),
      jwtToken,
      refreshToken: newRefreshToken.token,
    };
  }

  /**
   * generates a JWT, aka the access token
   *
   * @param {IUserModel} user what user the access token is for
   * @returns {string} the JWT
   * @memberof UserService
   */
  public generateAccesstoken(user: IUserModel): string {
    return jwt.sign({ sub: user._id, id: user._id }, config.get("jwt.secret"), {
      expiresIn: "15m",
    });
  }

  /**
   * finds a refresh token from the database
   *
   * @param {string} token the token to find in the database
   * @returns {Promise<IRefreshTokenModel>} the token document
   * @memberof UserService
   */
  public async getRefreshToken(token: string): Promise<IRefreshTokenModel> {
    const refreshToken = await RefreshToken.findOne({ token }).then();

    if (!refreshToken || !refreshToken.isActive)
      throw new UnauthorizedError({ errorCode: "error_invalid_token" });
    return refreshToken.populate("User").populate("user");
  }

  /**
   * generate a refresh token document without saving it in the database
   *
   * @param {IUserModel} user what user the refresh token is for
   * @param {string} ipAddress what ip address is generating the new refresh token
   * @memberof UserService
   */
  public generateRefreshtoken(
    user: IUserModel,
    ipAddress: string
  ): IRefreshTokenModel {
    return new RefreshToken({
      user: user.id,
      token: crypto.randomBytes(64).toString("hex"),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdByIP: ipAddress,
    });
  }

  /**
   * revokes a refresh token and makes it invalid. can take an optional parameter `replacedByToken` if another token replaces it
   *
   * @param {string} token what token to make invalid
   * @param {string} ipAddress what ip address is revoking the token
   * @param {string} [replacedByToken] an optional parameter that indicates what token replaces this one
   * @memberof UserService
   */
  public async revokeToken(
    token: string,
    ipAddress: string,
    replacedByToken?: string
  ): Promise<void> {
    const refreshToken = await this.getRefreshToken(token);

    refreshToken.revokedAt = new Date();
    refreshToken.revokedByIP = ipAddress;
    if (replacedByToken) refreshToken.replacedByToken = replacedByToken;
    await refreshToken.save();
  }

  /**
   * sets the refresh token cookie
   *
   * @param {Response} res the response object, used for setting the cookie
   * @param {string} token the token to be set as the refresh token
   * @memberof UserService
   */
  public setRefreshTokenCookie(res: Response, token: string): void {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days to hours => minutes => seconds => miliseconds
    };
    res.cookie("refreshToken", token, cookieOptions);
  }

  /**
   * maps a user document to a safer format without any sensitive details
   *
   * @private
   * @param {IUserModel} user the user that is used
   * @returns {{id: mongoose.Types.ObjectId, username: string}} the user details with all sensitive details stripped
   * @memberof UserService
   */
  private basicDetails(user: IUserModel) {
    const { id, username } = user;
    return { id, username };
  }
}
