import dotenv from "dotenv";
dotenv.config();
import MemberService from "../models/Member.service";
import mongoose from "mongoose";

async function main() {
  const mongoUrl = process.env.MONGO_CAMERA_SHOP_URL;
  if (!mongoUrl) throw new Error("Missing MONGO_CAMERA_SHOP_URL in .env");
  await mongoose.connect(mongoUrl, { dbName: "camera_shop" });
  const service = new MemberService();
  const res = await service.processLogin({
    memberNick: "valijon",
    memberPassword: "3323626v",
  });
  console.log("Login OK:", res.memberNick, res.memberType);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Test login failed:", err);
  process.exit(1);
});
