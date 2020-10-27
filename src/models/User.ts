import { model, Document, Schema } from "mongoose";

interface IUserSchema {
  username: string;
  password: string;
  teams: Array<undefined>; // To be added when teams are created
}

const UserSchema = new Schema<IUserSchema>({
  username: String,
  password: String,
  teams: [undefined], // To be added when teams are created
});

interface IUserModel extends IUserSchema, Document {}

const UserModel = model<IUserModel>("User", UserSchema);

export { UserSchema, UserModel, IUserSchema, IUserModel };
