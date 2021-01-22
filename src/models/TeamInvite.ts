import { model, Document, Schema } from "mongoose";

import { ITeam } from "./Team";
import { IUser } from "./User";

interface ITeamInvite extends Document {
  team: ITeam;
  inviteCode: string;
  expiry: Date;
  maxUses: number;
  createdAt: Date;
  createdByUser: IUser;
  uses: Array<IUser>;
}

const TeamInviteSchema = new Schema<ITeamInvite>({
  team: { type: Schema.Types.ObjectId, ref: "Team" },
  inviteCode: String,
  expiry: Date,
  maxUses: Number,
  createdAt: Date,
  createdByUser: { type: Schema.Types.ObjectId, ref: "User" },
  uses: [{ type: Schema.Types.ObjectId, ref: "User" }],
});


const TeamInviteModel = model<ITeamInvite>("Invite", TeamInviteSchema);

export {
  TeamInviteSchema,
  TeamInviteModel,
  ITeamInvite,
};
