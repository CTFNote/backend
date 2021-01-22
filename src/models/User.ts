import { model, Document, Schema } from "mongoose";

import { ITeam } from "./Team";

interface IUser extends Document {
  usernameCapitalization: string;
  username: string;
  password: string;
  teams: Array<ITeam>;
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
  usernameCapitalization: String,
  username: String,
  password: String,
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  isAdmin: Boolean,
});

const UserModel = model<IUser>("User", UserSchema);

export { UserSchema, UserModel, IUser };
