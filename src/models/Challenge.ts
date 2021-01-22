import { model, Document, Schema } from "mongoose";

import { IUser } from "./User";

interface IChallenge extends Document {
  notepad: string;
  points: number;
  solved: boolean;
  participants: Array<IUser>;
}

const ChallengeSchema = new Schema<IChallenge>({
  notepad: String,
  points: Number,
  solved: Boolean,
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const ChallengeModel = model<IChallenge>("Challenge", ChallengeSchema);

export { ChallengeSchema, ChallengeModel, IChallenge };
