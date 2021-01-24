import { model, Document, Schema } from "mongoose";

import { IChallenge } from "./Challenge";
import { ITeam } from "./Team";
// import { IUser } from "./User";

interface ICTF extends Document {
  notepad: string;
  challenges: Array<IChallenge>;
  team: ITeam
  // participants: Array<IUser>;
}

const CTFSchema = new Schema<ICTF>({
  notepad: String,
  challenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  team: { type: Schema.Types.ObjectId, ref: "Team" }
  // participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const CTFModel = model<ICTF>("CTF", CTFSchema);

export { CTFSchema, CTFModel, ICTF };
