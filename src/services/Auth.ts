import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { CookieOptions, Response } from "express";

import config from "../config";
import Logger from "../loaders/logger";
import { IUser, UserModel } from "../models/User";
import RefreshToken, { IRefreshToken } from "../models/RefreshToken";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../types/httperrors";
import {
  AuthenticatedUserData,
  BasicUserDetails,
  JWTData,
  TokenData,
} from "../types";
import { basicDetails } from "../util";

const saltRounds = config.get("saltRounds");

export default class AuthService {
  /**
   * registers a new user to the database
   *
   * @param {string} username what username to use for registration
   * @param {string} password the password the user will use
   * @param {string} ipAddress the ip address used to register the user
   * @returns {object} an object containing the user details, access token and refresh token
   * @memberof AuthService
   */
  public async registerUser(
    username: string,
    password: string,
    ipAddress: string
  ): Promise<AuthenticatedUserData> {
    Logger.verbose("Registering user");
    const userAlreadyExists = await UserModel.findOne({
      username: username.toLowerCase(),
    }).then();

    if (userAlreadyExists) {
      Logger.debug("Username taken; User exists");
      throw new ConflictError({
        errorMessage: "This username is already taken",
        errorCode: "error_user_exists",
      });
    }

    return bcrypt
      .hash(password, saltRounds)
      .then(async (hash) => {
        Logger.silly("Creating new user");
        const newUser = new UserModel({
          usernameCapitalization: username,
          username: username.toLowerCase(),
          password: hash,
          teams: [],
          isAdmin: false,
        });
        Logger.silly("Saving new user to the DB");
        await newUser.save();
        Logger.silly("Returning basic user details and tokens");
        return {
          user: basicDetails(newUser),
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
   * @memberof AuthService
   */
  public async authenticateUser(
    username: string,
    password: string,
    ipAddress: string
  ): Promise<AuthenticatedUserData> {
    Logger.verbose("Authenticating user");
    const user = await UserModel.findOne({ username: username.toLowerCase() });

    Logger.debug({ user });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      Logger.verbose("Invalid credentials to login");
      throw new BadRequestError({
        errorCode: "error_invalid_credentials",
        details: "Username or password is incorrect",
      });
    }

    Logger.silly("Returning basic user details after logon");
    return {
      user: basicDetails(user),
      ...(await this.generateTokens(user, ipAddress)),
    };
  }

  /**
   * logs out a user by revoking refresh tokens and unsetting cookies
   *
   * @param {string} token the refresh token used when logging out
   * @param {string} ip what ip is logging out
   * @param {Response} res the response object in order to remove the cookie
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  public async logoutUser(
    token: string,
    ip: string,
    res: Response
  ): Promise<void> {
    Logger.verbose("Revoking token (Logout)");
    this.revokeToken(token, ip);
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };
    Logger.silly("Clearing cookie");
    res.clearCookie("refreshToken", options);
  }

  /**
   * generates the JWT and refresh tokens that will be returned to the user
   *
   * @private
   * @param {IUser} user what user the tokens should be generated for
   * @param {string} ipAddress what ip address is used to generate the tokens
   * @returns the jwt and refresh tokens
   * @memberof AuthService
   */
  private async generateTokens(
    user: IUser,
    ipAddress: string
  ): Promise<TokenData> {
    Logger.verbose("Generating tokens");
    const jwtToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, ipAddress);

    Logger.silly("Saving tokens");
    await refreshToken.save();

    Logger.silly("Returning tokens");
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
   * @memberof AuthService
   */
  public async getBasicUser(
    id: mongoose.Types.ObjectId
  ): Promise<BasicUserDetails> {
    Logger.verbose("Returning basic user details");
    return basicDetails(await this.getFullUser(id));
  }

  /**
   * gets all information on a user. this includes any and all sensitive information.
   *
   * @param {mongoose.Types.ObjectId} id the id of the user to find details on
   * @returns {Promise<IUser>} the whole document on the user
   * @memberof AuthService
   */
  private async getFullUser(id: mongoose.Types.ObjectId): Promise<IUser> {
    Logger.silly("Checking for valid ObjectId");
    if (!isValidObjectId(id)) {
      throw new BadRequestError({ errorCode: "error_invalid_id" });
    }

    Logger.silly("Fetching user for getFullUser");
    const user = await UserModel.findById(id).then();

    if (!user) {
      Logger.silly("User not found, throwing");
      throw new NotFoundError({ errorCode: "error_user_not_found" });
    }

    Logger.silly("Returning full user");
    return user;
  }

  /**
   * generates a new refresh token while revoking the old one
   *
   * @param {string} token the token to revoke
   * @param {string} ipAddress the ip adress that is regenerating the token
   * @returns user details along with a JWT and the new refresh token
   * @memberof AuthService
   */
  public async regenerateRefreshToken(
    token: string,
    ipAddress: string
  ): Promise<AuthenticatedUserData> {
    Logger.verbose("Regenerating refreshToken");

    const refreshToken = await (await this.getRefreshToken(token))
      .populate("User")
      .execPopulate();
    const user = await this.getFullUser(refreshToken.user._id);
    Logger.debug({ refreshToken, user });

    Logger.silly("Generating refresh token");
    const newRefreshToken = this.generateRefreshToken(user, ipAddress);

    Logger.silly("Revoking old token");
    await this.revokeToken(token, ipAddress, newRefreshToken.token);

    Logger.silly("Saving new token");
    await newRefreshToken.save();

    Logger.silly("Generating accessToken");
    const jwtToken = this.generateAccessToken(user);

    Logger.silly("Returning user, jwtToken, and refreshToken");
    return {
      user: basicDetails(user),
      jwtToken,
      refreshToken: newRefreshToken.token,
    };
  }

  /**
   * generates a JWT, aka the access token
   *
   * @param {IUser} user what user the access token is for
   * @returns {string} the JWT
   * @memberof AuthService
   */
  private generateAccessToken(user: IUser): string {
    const jwtData: JWTData = { sub: user._id, id: user._id };

    if (user.isAdmin) {
      jwtData.isAdmin = true;
    }
    Logger.debug(jwtData);

    Logger.silly("Returning signed JWT with 15 minute expiry");
    return jwt.sign(jwtData, config.get("jwt.secret"), {
      expiresIn: config.get("jwt.duration"),
    });
  }

  /**
   * finds a refresh token from the database
   *
   * @param {string} token the token to find in the database
   * @returns {Promise<IRefreshToken>} the token document
   * @memberof AuthService
   */
  private async getRefreshToken(token: string): Promise<IRefreshToken> {
    const refreshToken = await RefreshToken.findOne({ token }).then();

    if (!refreshToken || !refreshToken.isActive) {
      Logger.silly("Invalid token");
      Logger.debug(refreshToken);
      throw new UnauthorizedError({ errorCode: "error_invalid_token" });
    }

    return await refreshToken.populate("user").execPopulate();
  }

  /**
   * generate a refresh token document without saving it in the database
   *
   * @param {IUser} user what user the refresh token is for
   * @param {string} ipAddress what ip address is generating the new refresh token
   * @memberof AuthService
   */
  private generateRefreshToken(user: IUser, ipAddress: string): IRefreshToken {
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
   * @memberof AuthService
   */
  private async revokeToken(
    token: string,
    ipAddress: string,
    replacedByToken?: string
  ): Promise<void> {
    const refreshToken = await this.getRefreshToken(token);

    refreshToken.revokedAt = new Date();
    refreshToken.revokedByIP = ipAddress;
    if (replacedByToken) {
      refreshToken.replacedByToken = replacedByToken;
    }
    Logger.silly("Saving old refreshToken and returning void");
    await refreshToken.save();
  }

  /**
   * sets the refresh token cookie
   *
   * @param {Response} res the response object, used for setting the cookie
   * @param {string} token the token to be set as the refresh token
   * @memberof AuthService
   */
  public setRefreshTokenCookie(res: Response, token: string): void {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days to hours => minutes => seconds => miliseconds
    };
    Logger.silly("Setting refresh token cookie");
    res.cookie("refreshToken", token, cookieOptions);
  }
}
