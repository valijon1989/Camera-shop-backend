import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import MemberModel from "../schema/Member.model";
import { MemberType, MemberStatus } from "../libs/enums/member.enum";

async function resetAdmin() {
  const mongoUrl = process.env.MONGO_CAMERA_SHOP_URL;
  if (!mongoUrl) throw new Error("Missing MONGO_CAMERA_SHOP_URL in .env");

  await mongoose.connect(mongoUrl, { dbName: "camera_shop" });
  console.log("Connected to DB");

  const delRes = await MemberModel.deleteMany({ memberType: MemberType.ADMIN });
  console.log("Deleted admins:", delRes.deletedCount);

  const hash = await bcrypt.hash("3323626v", await bcrypt.genSalt());
  const doc = await MemberModel.create({
    memberNick: "valijon",
    memberPhone: "01091513626",
    memberPassword: hash,
    memberType: MemberType.ADMIN,
    memberStatus: MemberStatus.ACTIVE,
  });
  console.log("Created admin:", doc.memberNick);

  await mongoose.disconnect();
}

resetAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
