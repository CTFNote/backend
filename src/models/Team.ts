import { model, Document, Schema } from "mongoose";

import { TeamSocials } from "../types";
import { ICTFSchema } from "./CTF";
import { IUserSchema } from "./User";

interface ITeamSchema {
  name: string;
  owner: IUserSchema;
  socials: TeamSocials;
  members: Array<IUserSchema>;
  CTFs: Array<ICTFSchema>;
}

const TeamSchema = new Schema<ITeamSchema>({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  socials: Object,
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  CTFs: [{ type: Schema.Types.ObjectId, ref: "CTF" }],
});

interface ITeamModel extends ITeamSchema, Document {}

const TeamModel = model<ITeamModel>("Team", TeamSchema);

export { TeamSchema, TeamModel, ITeamSchema, ITeamModel };
