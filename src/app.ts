import express from "express";

import config from "./config";
import loaders from "./loaders";
import Logger from "./loaders/logger";

const app = express();

const port = config.get("port");
const host = config.get("host");

loaders(app).then((): void => {
  app
    .listen(port, host, (): void => {
      Logger.info(`Express listening on ${host}:${port}`);
    })
    .on("error", (err): void => {
      Logger.error(err);
      process.exit(1);
    });
});
