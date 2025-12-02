import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import MemberModel from "../schema/Member.model";
import * as bcrypt from "bcryptjs";
import { MemberType } from "../libs/enums/member.enum";

async function checkAdmin() {
  const mongoUrl = process.env.MONGO_CAMERA_SHOP_URL;
  if (!mongoUrl) throw new Error("Missing MONGO_CAMERA_SHOP_URL in .env");
  await mongoose.connect(mongoUrl, { dbName: "camera_shop" });
  const admin = await MemberModel.findOne({
    memberNick: "valijon",
    memberType: MemberType.ADMIN,
  }).select("+memberPassword");
  console.log("Admin:", {
    nick: admin?.memberNick,
    phone: admin?.memberPhone,
    status: admin?.memberStatus,
    type: admin?.memberType,
  });
  const match = admin?.memberPassword
    ? await bcrypt.compare("3323626v", admin.memberPassword)
    : false;
  console.log("Password matches default:", match);
  await mongoose.disconnect();
}

checkAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
