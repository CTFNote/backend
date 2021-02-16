import { ITeam } from "../models/Team";
import { IUser } from "../models/User";

declare module "express" {
  export interface Request {
    user?: IUser;
    team?: ITeam;
  }
}
