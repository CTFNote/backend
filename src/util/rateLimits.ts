import rateLimit from "express-rate-limit";
import config from "../config";

const authRateLimit = rateLimit({
  windowMs: config.get("rateLimit.auth.windowMs"),
  max: config.get("rateLimit.auth.max"),
});

export { authRateLimit };
