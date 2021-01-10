import { model, Document, Schema } from "mongoose";

import { TeamSocials } from "../types";
import { ICTFSchema } from "./CTF";
import { IUserModel } from "./User";

interface ITeamSchema {
  name: string;
  owner: IUserModel;
  socials: TeamSocials;
  members: Array<IUserModel>;
  CTFs: Array<ICTFSchema>;
  invites: Array<ITeamSchema>;
  isOwner(user: IUserModel): boolean;
  inTeam(user: IUserModel): boolean;
}

const TeamSchema = new Schema<ITeamSchema>({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  socials: Object,
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  CTFs: [{ type: Schema.Types.ObjectId, ref: "CTF" }],
  invites: [{ type: Schema.Types.ObjectId, ref: "TeamInvite" }],
});

TeamSchema.methods.isOwner = function (user: IUserModel) {
  return this.owner.equals(user._id); // Compares the owner's ID to the passed in user's ID
};

TeamSchema.methods.inTeam = function (user: IUserModel) {
  return user._id in this.members || this.owner.equals(user._id);
};

interface ITeamModel extends ITeamSchema, Document {}

const TeamModel = model<ITeamModel>("Team", TeamSchema);

export { TeamSchema, TeamModel, ITeamSchema, ITeamModel };
