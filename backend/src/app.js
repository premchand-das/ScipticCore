import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";

import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";
import { logger } from "./services/logger.service.js";
import mongoSanitizeMiddleware from "./middleware/mongoSanitize.middleware.js";

const app = express();

app.disable("etag");

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.removeHeader("ETag");
  }

  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://scipticcore.vercel.app",
  "https://scipticcore.com",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);




app.use(helmet({
  crossOriginResourcePolicy: false
}));


app.use(mongoSanitizeMiddleware);
app.use(hpp({
  whitelist: [
    "tags"]}));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkepticCore API is running"
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;