import dotenv from "dotenv";
import mongoose from "mongoose";
import Member from "../schema/Member.model";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

dotenv.config();

async function run() {
  const url =
    process.env.MONGO_CAMERA_SHOP_URL ||
    process.env.MONGO_URL ||
    "mongodb://127.0.0.1:27017/camera_shop";

  await mongoose.connect(url);

  const res = await Member.updateMany(
    { memberType: { $ne: MemberType.ADMIN }, memberStatus: { $ne: MemberStatus.DELETE } },
    { $set: { memberType: MemberType.AGENT } }
  );

  console.log("Updated docs:", res.modifiedCount);
  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
