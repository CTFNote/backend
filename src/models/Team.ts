import { model, Document, Schema } from "mongoose";

import { TeamSocials } from "../types";
import { ICTF } from "./CTF";
import { ITeamInvite } from "./TeamInvite";
import { IUser } from "./User";

interface ITeam extends Document {
  name: string;
  owner: IUser;
  socials: TeamSocials;
  members: Array<IUser>;
  CTFs: Array<ICTF>;
  invites: Array<ITeamInvite>;
  isOwner(user: IUser): boolean;
  inTeam(user: IUser): boolean;
}

const TeamSchema = new Schema<ITeam>({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  socials: Object,
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  CTFs: [{ type: Schema.Types.ObjectId, ref: "CTF" }],
  invites: [{ type: Schema.Types.ObjectId, ref: "TeamInvite" }],
});

TeamSchema.methods.isOwner = function (user: IUser) {
  return this.owner.equals(user._id); // Compares the owner's ID to the passed in user's ID
};

TeamSchema.methods.inTeam = function (user: IUser) {
  return user._id in this.members || this.owner.equals(user._id);
};


const TeamModel = model<ITeam>("Team", TeamSchema);

export { TeamSchema, TeamModel, ITeam,  };
