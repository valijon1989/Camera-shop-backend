import dotenv from "dotenv";
dotenv.config();
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

import session from "express-session";
import { T } from "./libs/types/common";

/* 1- ENTRANCE */
const app = express(); //expressni execution natijasida app maqsadli objectni olamiz

// CORS: frontend domen(lar)ini env orqali boshqarish
const defaultPort = process.env.PORT || 9090;
const defaultOrigins = [
  "http://localhost:3000",
  `http://localhost:${defaultPort}`,
  `http://127.0.0.1:${defaultPort}`,
];
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || defaultOrigins.join(",")
)
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, "")) // trailing slashlarni olib tashlaymiz
  .filter(Boolean);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl yoki server-side request
      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
      return callback(new Error(`CORS bloklandi: ${origin}`));
    },
  })
); // ixtiyoriy domain ni saytimizga kirishiga ruxsat

app.use(express.static(path.join(__dirname, "public")));
// Uploads xizmatini /uploads va /api/uploads prefikslari uchun ham bir xil ko'rinishda beramiz
const serveUploads: express.RequestHandler = (req, res, next) => {
  const uploadsRoot = path.join(process.cwd(), "uploads");

  // Frontend ba'zan "uploads/uploads/..." shaklida takroriy prefiks yuboradi,
  // shu sababli pathni tozalab yuboramiz.
  const normalizedPath = req.path.replace(/^\/+/g, "").replace(/^uploads[\\/]/, "");
  const filePath = path.join(uploadsRoot, normalizedPath);

  if (fs.existsSync(filePath)) return res.sendFile(filePath);

  // Fallback: agar fayl ishlayotgan mashinaning "Desktop/mac/camera" papkasida bo'lsa ham ko'rsatsin
  const externalMediaRoot = path.join(process.env.HOME || "", "Desktop", "mac", "camera");
  const externalPath = path.join(externalMediaRoot, normalizedPath.replace(/^uploads[\\/]/, ""));
  if (fs.existsSync(externalPath)) return res.sendFile(externalPath);

  const fallback = path.join(uploadsRoot, "placeholder-product.jpg");
  if (fs.existsSync(fallback)) return res.sendFile(fallback);
  return next();
};

app.use("/uploads", serveUploads);
app.use("/api/uploads", serveUploads);
// Allow larger payloads (e.g. profile images/base64 from frontend) without 413/PayloadTooLarge
const bodyLimit = process.env.BODY_LIMIT || "50mb";
app.use(express.urlencoded({ extended: true, limit: bodyLimit })); //=> support Traditional API/form post
app.use(express.json({ limit: bodyLimit })); //support Rest API/ json farmatdagi data oldi berdisi
app.use(cookieParser()); //TOKEN
app.use(morgan(MORGAN_FORMAT)); //Logging jarayonini tashkil qib beradi,

// Disable caching for API responses to avoid stale 304s in the frontend
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.set("Cache-Control", "no-store");
  }
  next();
});

/* 2-SESSIONS */
app.use(
  session({
    //session bu core functon/ session bosh boladi
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 60 * 60 * 6,
    },
    // MemoryStore fallback: atlas sessiya storeni ulay olmasa ham ishlaydi
    resave: false,
    saveUninitialized: false,
  })
);
//session boyiydi/ req.session+member (qaytganda)

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member; //res.locals. = browser variable
  next();
});

// Simple diagnostics endpoint
app.get("/test-backend", (_req, res) => {
  res.json({ status: "backend-ok", port: process.env.PORT || 3003 });
});

/* 3-VIEWS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* 4-ROUTERS */
app.use("/admin", routerAdmin);
app.use("/api", router); // SPA/REST with /api prefix for frontend clients
app.use("/api/help", helpRoutes);
// Simple root handler so redirects to "/" don't return 404
app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Camera Shop backend is running");
});
app.use("/", router); // REST API / SPA

export default app; // module.exports = app.js;

/*Burak backend ni ikki hil maqsadda ishlatamiz:
1. app.use("/", router); => Burak SPA: ni userlar uchun xizmat qiladigan
 REACT loyihamiz uchun REST API sifatida ishlatamiz
res.json => REST API
REST API => boshqa toollar orqali amalga oshadi

2. app.use("/admin", routerAdmin); => 
Traditional API BSSR da quramiz, BUrak adminka qilamniz 
res.send/ res.end / ... Traditional API
TRaditional API => HTML ni backendda qurilganda shu API dan foydalaniladi, 
va Form va Post orqali HTML orqali amalga oshadi


BSSR => Traditioanl API & REST API
SPA => REST API
*/
