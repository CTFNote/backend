import { model, Document, Schema } from "mongoose";
import { TeamSocials } from "../types";
import { IUserSchema } from "./User";

interface ITeamSchema {
  name: string;
  creator: IUserSchema;
  socials: TeamSocials;
  members: Array<IUserSchema>;
  CTFs: Array<undefined>;
}

const TeamSchema = new Schema<ITeamSchema>({
  name: String,
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  socials: Object,
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  CTFs: [undefined],
});

interface ITeamModel extends ITeamSchema, Document {}

const TeamModel = model<ITeamModel>("Team", TeamSchema);

export { TeamSchema, TeamModel, ITeamSchema, ITeamModel };
