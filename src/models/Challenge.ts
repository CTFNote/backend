import { model, Document, Schema } from "mongoose";

import { IUserSchema } from "./User";

interface IChallengeSchema {
  notepad: string;
  points: number;
  solved: boolean;
  participants: Array<IUserSchema>;
}

const ChallengeSchema = new Schema<IChallengeSchema>({
  notepad: String,
  points: Number,
  solved: Boolean,
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

interface IChallengeModel extends IChallengeSchema, Document {}

const ChallengeModel = model<IChallengeModel>("Challenge", ChallengeSchema);

export { ChallengeSchema, ChallengeModel, IChallengeSchema, IChallengeModel };
