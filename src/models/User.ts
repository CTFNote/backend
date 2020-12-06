import { model, Document, Schema } from "mongoose";

import { ITeamSchema } from "./Team";

interface IUserSchema {
  usernameCapitalization: string;
  username: string;
  password: string;
  teams: Array<ITeamSchema>;
}

const UserSchema = new Schema<IUserSchema>({
  usernameCapitalization: String,
  username: String,
  password: String,
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
});

interface IUserModel extends IUserSchema, Document {}

const UserModel = model<IUserModel>("User", UserSchema);

export { UserSchema, UserModel, IUserSchema, IUserModel };
