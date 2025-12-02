import dotenv from "dotenv";
import mongoose from "mongoose";
import MemberModel from "../schema/Member.model";
import { MemberType } from "../libs/enums/member.enum";

dotenv.config();

async function migrateRestaurantToAdmin() {
  const mongoUrl = process.env.MONGO_CAMERA_SHOP_URL;
  if (!mongoUrl) {
    throw new Error("Missing MONGO_CAMERA_SHOP_URL");
  }
  await mongoose.connect(mongoUrl);

  const result = await MemberModel.updateMany(
    { memberType: "RESTAURANT" },
    { $set: { memberType: MemberType.ADMIN } }
  );

  console.log("Updated members:", result.modifiedCount);
  await mongoose.disconnect();
}

migrateRestaurantToAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
