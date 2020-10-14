import convict from "convict";
import { ipaddress } from "convict-format-with-validator";
import { existsSync } from "fs";

convict.addFormat(ipaddress);

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  host: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "HOST",
    arg: "host",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port",
  },
  db: {
    host: {
      doc: "Database host name/IP and port",
      format: "*",
      default: "mongodb://localhost:27017",
      env: "MONGO_URI",
    },
    db: {
      doc: "Database name",
      format: String,
      default: "mevn-stack",
      env: "MONGO_DB_NAME",
    },
  },
  logging: {
    level: {
      doc: "How detailed the logging should be",
      format: String,
      default: "debug",
      env: "LOGGING_LEVEL",
    },
  },
});

if (config.get("env") === "production") {
  config.validate({ allowed: "strict" });
} else if (config.get("env") === "test") {
  if (existsSync("./.env.test.json")) {
    config.loadFile(`.env.test.json`);
    config.validate({ allowed: "strict" });
  } else {
    console.warn("\x1b[41m⚠️ Test config missing, using default values ⚠️\x1b[0m");
  }
} else if (config.get("env") === "development") {
  if (existsSync("./.env.development.json")) {
    config.loadFile(`.env.development.json`);
    config.validate({ allowed: "strict" });
  } else {
    console.warn("\x1b[41m⚠️ Development config missing, using default values ⚠️\x1b[0m");
  }
}

export default config;
