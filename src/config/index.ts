import convict from "convict";
import { ipaddress } from "convict-format-with-validator";
import { existsSync } from "fs";
import { resolve } from "path";

convict.addFormat(ipaddress);

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "production",
    env: "NODE_ENV",
  },
  host: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "0.0.0.0",
    env: "HOST",
    arg: "host",
  },
  port: {
    doc: "What port to use for http",
    format: "port",
    default: 80,
    env: "PORT",
    arg: "port",
  },
  httpsPort: {
    doc: "What port to use for https",
    format: "port",
    default: 443,
    env: "HTTP_PORT",
    arg: "httpsPort",
  },
  httpsEnabled: {
    doc:
      "Whether or not HTTPS should be enabled (for example when running in a docker container)",
    format: Boolean,
    default: true,
    env: "HTTPS_ENABLED",
  },
  cors: {
    doc: "What origins are allowed to connect to the backend",
    format: "*",
    default: ["0.0.0.0/0"],
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
      default: "ctfnote",
      env: "MONGO_DB_NAME",
    },
  },
  logging: {
    level: {
      doc: "How detailed the logging should be",
      format: String,
      default: "http",
      env: "LOGGING_LEVEL",
    },
  },
  jwt: {
    secret: {
      doc: "The JWT secret",
      format: String,
      env: "JWT_SECRET",
      default: "",
    },
    refreshToken: {
      doc: "A refresh token for refreshing JWTs? idk",
      format: String,
      env: "JWT_REFRESH",
      default: "",
    },
  },
  saltRounds: {
    doc: "How many times bcrypt will go over the password before returning it",
    format: Number,
    default: 10,
    env: "SALT_ROUNDS",
  },
});

if (config.get("env") === "production") {
  config.validate({ allowed: "strict" });
} else if (config.get("env") === "test") {
  if (existsSync(resolve(__dirname, "./.env.test.json"))) {
    config.loadFile(resolve(__dirname, "./.env.test.json"));
    config.validate({ allowed: "strict" });
  } else {
    console.warn(
      "\x1b[41m⚠️ Test config missing, using default values ⚠️\x1b[0m"
    );
  }
} else if (config.get("env") === "development") {
  if (existsSync(resolve(__dirname, "./.env.development.json"))) {
    config.loadFile(resolve(__dirname, "./.env.development.json"));
    config.validate({ allowed: "strict" });
  } else {
    console.warn(
      "\x1b[41m⚠️ Development config missing, using default values ⚠️\x1b[0m"
    );
  }
}

export default config;
