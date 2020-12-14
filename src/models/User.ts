import { model, Document, Schema } from "mongoose";

import { ITeamSchema } from "./Team";

interface IUserSchema {
  usernameCapitalization: string;
  username: string;
  password: string;
  teams: Array<ITeamSchema>;
  isAdmin: boolean;
}

const UserSchema = new Schema<IUserSchema>({
  usernameCapitalization: String,
  username: String,
  password: String,
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  isAdmin: Boolean,
});

interface IUserModel extends IUserSchema, Document {}

const UserModel = model<IUserModel>("User", UserSchema);

export { UserSchema, UserModel, IUserSchema, IUserModel };
