import "./load-env";
import cors from "cors";
import express from "express";
import path from "path";
import fs from "fs";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";
import cookieParser from "cookie-parser";
import helpRoutes from "./routes/helpRoutes";
import apiRouter from "./api/api.router";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import session from "express-session";
import { T } from "./libs/types/common";
import { createSessionStore } from "./libs/session-store";

/* 1- ENTRANCE */
const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((item) => item.trim())
  .filter((item) => item.length > 0);

console.log("ALLOWED_ORIGINS:", allowedOrigins);

const corsOrigin = function (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) {
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("CORS bloklandi: " + origin));
};

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

// Uploads xizmatini /uploads va /api/uploads prefikslari uchun ham bir xil ko'rinishda beramiz
const serveUploads: express.RequestHandler = (req, res, next) => {
  const uploadsRoot = path.join(process.cwd(), "uploads");

  const normalizedPath = req.path.replace(/^\/+/g, "").replace(/^uploads[\\/]/, "");
  const filePath = path.join(uploadsRoot, normalizedPath);

  if (fs.existsSync(filePath)) return res.sendFile(filePath);

  const externalMediaRoot = path.join(process.env.HOME || "", "Desktop", "mac", "camera");
  const externalPath = path.join(externalMediaRoot, normalizedPath.replace(/^uploads[\\/]/, ""));
  if (fs.existsSync(externalPath)) return res.sendFile(externalPath);

  const fallback = path.join(uploadsRoot, "placeholder-product.jpg");
  if (fs.existsSync(fallback)) return res.sendFile(fallback);

  return next();
};

app.use("/uploads", serveUploads);
app.use("/api/uploads", serveUploads);

const bodyLimit = process.env.BODY_LIMIT || "50mb";
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
app.use(express.json({ limit: bodyLimit }));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.set("Cache-Control", "no-store");
  }
  next();
});

/* 2-SESSIONS */
const sessionMongoUri =
  process.env.MONGO_CAMERA_SHOP_URL ||
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/camera_shop";

app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 60 * 60 * 6,
    },
    store: createSessionStore(sessionMongoUri),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

app.get("/test-backend", (_req, res) => {
  res.json({ status: "backend-ok", port: process.env.PORT || 3003 });
});

/* 3-VIEWS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* 4-ROUTERS */
app.use("/admin", routerAdmin);
app.use("/api", router);
app.use("/api", apiRouter);
app.use("/api/help", helpRoutes);

app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Camera Shop backend is running");
});

app.use("/", router);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

let summaryClient = 0;

io.on("connection", (socket) => {
  summaryClient++;
  console.log(`Connection & total [${summaryClient}]`);

  socket.on("disconnect", () => {
    summaryClient--;
    console.log(`Disconnection & total [${summaryClient}]`);
  });
});

export { app, server };
export default server;
