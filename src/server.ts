import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
import bcrypt from "bcryptjs";
import MemberModel from "./schema/Member.model";
import { MemberStatus, MemberType } from "./libs/enums/member.enum";
import server from "./app";

// Global guards: log unexpected errors so process doesn't silently exit/restart
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

console.log("ENV PORT:", process.env.PORT);
console.log("ENV MONGO_CAMERA_SHOP_URL:", process.env.MONGO_CAMERA_SHOP_URL);
console.log("ENV MONGO_URL:", process.env.MONGO_URL);
console.log("ENV SESSION_SECRET:", process.env.SESSION_SECRET);
console.log("ENV SECRET_TOKEN:", process.env.SECRET_TOKEN);

async function ensureDefaultAdmin() {
  const nick = "valijon";
  const phone = "01091513626";
  const password = "3323626v";

  const hash = await bcrypt.hash(password, await bcrypt.genSalt());
  await MemberModel.findOneAndUpdate(
    { memberNick: nick },
    {
      $set: {
        memberNick: nick,
        memberPhone: phone,
        memberPassword: hash,
        memberType: MemberType.ADMIN,
        memberStatus: MemberStatus.ACTIVE,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Demote other admins to USER so only one admin remains
  await MemberModel.updateMany(
    { memberType: MemberType.ADMIN, memberNick: { $ne: nick } },
    { $set: { memberType: MemberType.USER } }
  );
}

const atlasUrl =
  (process.env.MONGO_CAMERA_SHOP_URL as string | undefined) ||
  "mongodb+srv://volfvolf0505:3323626valijon@cluster0.pztgqtr.mongodb.net/camera_shop?retryWrites=true&w=majority";
const localUrl = "mongodb://127.0.0.1:27017/camera_shop";
const listenHost = (process.env.HOST as string | undefined) || "0.0.0.0";

async function start() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(atlasUrl || localUrl);
    console.log("Camera Shop DB Connected");
    try {
      // Drop legacy non-sparse email index if present, then syncIndexes to use sparse definition
      await MemberModel.collection.dropIndex("email_1");
    } catch (err: any) {
      if (err?.code !== 27) console.warn("dropIndex email_1 warning:", err.message);
    }
    await MemberModel.syncIndexes();
  } catch (err) {
    console.error("DB Error (primary):", err);
    if (atlasUrl && atlasUrl.startsWith("mongodb+srv://")) {
      console.warn("Retrying with local MongoDB fallback...");
      await mongoose.connect(localUrl);
      console.log("Camera Shop DB Connected (local fallback)");
    } else {
      throw err;
    }
  }

  await ensureDefaultAdmin();
  const PORT = process.env.PORT ?? 9090;
  const appUrl = ((process.env.APP_URL as string | undefined) || "").trim().replace(/\/+$/, "");
  const adminUrl = appUrl ? `${appUrl}/admin` : `http://${listenHost}:${PORT}/admin`;
  server.listen(Number(PORT), listenHost, function () {
    console.info(`The serveris running succesfully on port: ${PORT}`);
    console.info(`Admin project on ${adminUrl} \n`);
  });
}

start().catch((err) => console.error("DB Error:", err));

/* PATTERNS

  ARCHITECTURE pattern: MVC DI REDUX CACHE
  DESIGN pattern: MiddleWare Decorator 

  BURAK => MVC MiddleWare REDUX
  NESTAR => MVC DI MiddleWare Decorator CACHE

*/
