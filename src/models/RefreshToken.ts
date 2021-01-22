import { Document, model, Schema } from "mongoose";
import { IUser } from "./User";

interface IRefreshToken extends Document {
  user: IUser;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  createdByIP: string;
  revokedAt: Date;
  revokedByIP: string;
  replacedByToken: string;

  // Virtuals
  isExpired: boolean;
  isActive: boolean;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  token: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  createdByIP: String,
  revokedAt: Date,
  revokedByIP: String,
  replacedByToken: String,
});

RefreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expiresAt;
});

RefreshTokenSchema.virtual("isActive").get(function () {
  return (
    !(this as IRefreshToken).revokedAt && !(this as IRefreshToken).isExpired
  );
});

RefreshTokenSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

const RefreshTokenModel = model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);

export default RefreshTokenModel;

export { RefreshTokenSchema, RefreshTokenModel, IRefreshToken };
