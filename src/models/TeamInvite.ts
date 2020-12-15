import { model, Document, Schema } from "mongoose";

import { ITeamModel } from "./Team";
import { IUserModel } from "./User";

interface ITeamInviteSchema {
  team: ITeamModel;
  inviteCode: string;
  expiry: Date;
  maxUses: number;
  createdAt: Date;
  createdByUser: IUserModel;
  uses: Array<IUserModel>;
}

const TeamInviteSchema = new Schema<ITeamInviteSchema>({
  team: { type: Schema.Types.ObjectId, ref: "Team" },
  inviteCode: String,
  expiry: Date,
  maxUses: Number,
  createdAt: Date,
  createdByUser: { type: Schema.Types.ObjectId, ref: "User" },
  uses: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

interface ITeamInviteModel extends ITeamInviteSchema, Document {}

const TeamInviteModel = model<ITeamInviteModel>("Invite", TeamInviteSchema);

export {
  TeamInviteSchema,
  TeamInviteModel,
  ITeamInviteSchema,
  ITeamInviteModel,
};
