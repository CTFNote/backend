import mongoose from "mongoose";

import config from "../config";
import Logger from "./logger";

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

export default async (): Promise<void> => {
  mongoose.connection.on("error", (err) => {
    Logger.error(err);
  });
  mongoose.connection.once("connected", () => {
    Logger.info("MongoDB connected");
  });
  mongoose.connection.on("disconnected", () => {
    Logger.warn("MongoDB disconnected");
  });
  mongoose.connection.on("reconnected", () => {
    Logger.info("MongoDB reconnected after disconnecting");
  });
  mongoose.connection.on("reconnectFailed", () => {
    Logger.error("MongoDB reconnect failed");
  });
  Logger.debug("Mongoose events registered");
  await mongoose.connect(`${config.get("db.host")}/${config.get("db.db")}`);
};
