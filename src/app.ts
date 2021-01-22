import express from "express";
import { readFileSync } from "fs";
import http from "http";
import https from "https";
import { resolve } from "path";

import config from "./config";
import loaders from "./loaders";
import Logger from "./loaders/logger";

const app = express();

const port = config.get("port");
const httpsPort = config.get("httpsPort");
const host = config.get("host");

let httpsConfig: https.ServerOptions;

if (config.get("httpsEnabled")) {
  try {
  httpsConfig = {
    key: readFileSync(resolve(__dirname, "ssl/key.pem")),
    cert: readFileSync(resolve(__dirname, "ssl/cert.pem")),
  };} catch (err) {
    Logger.error("HTTPS is enabled, but certificates cannot be found. Disabling HTTPS.");
    config.set("httpsEnabled", false);
  }
}
loaders(app).then((): void => {
  const httpServer = http.createServer(app);

  httpServer
    .listen(port, host)
    .on("listening", () => {
      Logger.warn(`HTTP listening on ${host}:${port}`);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });

  if (config.get("httpsEnabled")) {
    https
      .createServer(httpsConfig, app)
      .listen(httpsPort, host)
      .on("listening", () => {
        Logger.warn(`HTTPS listening on ${host}:${httpsPort}`);
      })
      .on("error", (err) => {
        Logger.error(err);
        process.exit(1);
      });
  } else {
    Logger.warn("HTTPS not enabled");
  }
});
