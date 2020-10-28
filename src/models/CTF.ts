import { model, Document, Schema } from "mongoose";

import { IChallengeModel } from "./Challenge";
import { IUserSchema } from "./User";

interface ICTFSchema {
  notepad: string;
  challenges: Array<IChallengeModel>;
  participants: Array<IUserSchema>;
}

const CTFSchema = new Schema<ICTFSchema>({
  notepad: String,
  challenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

interface ICTFModel extends ICTFSchema, Document {}

const CTFModel = model<ICTFModel>("CTF", CTFSchema);

export { CTFSchema, CTFModel, ICTFSchema, ICTFModel };
