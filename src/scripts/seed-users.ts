import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import MemberModel from "../schema/Member.model";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

const demoUsers = [
  {
    memberNick: "demo1",
    memberPhone: "01000000001",
    email: "demo1@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.USER,
  },
  {
    memberNick: "demo2",
    memberPhone: "01000000002",
    email: "demo2@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.USER,
  },
  {
    memberNick: "agent1",
    memberPhone: "01000000003",
    email: "agent1@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.AGENT,
  },
  {
    memberNick: "demo3",
    memberPhone: "01000000004",
    email: "demo3@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.USER,
  },
  {
    memberNick: "demo4",
    memberPhone: "01000000005",
    email: "demo4@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.USER,
  },
  {
    memberNick: "demo5",
    memberPhone: "01000000006",
    email: "demo5@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.USER,
  },
  {
    memberNick: "agent2",
    memberPhone: "01000000007",
    email: "agent2@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.AGENT,
  },
  {
    memberNick: "demo6",
    memberPhone: "01000000008",
    email: "demo6@example.com",
    memberPassword: "demo1234",
    memberImage: "uploads/placeholder-product.jpg",
    memberType: MemberType.USER,
  },
];

async function seedUsers() {
  const mongoUrl = process.env.MONGO_CAMERA_SHOP_URL;
  if (!mongoUrl) throw new Error("Missing MONGO_CAMERA_SHOP_URL in .env");
  await mongoose.connect(mongoUrl, { dbName: "camera_shop" });
  console.log("Connected to DB");

  for (const user of demoUsers) {
    const hash = await bcrypt.hash(user.memberPassword, await bcrypt.genSalt());
    await MemberModel.findOneAndUpdate(
      { memberNick: user.memberNick },
      {
        $set: {
          ...user,
          memberPassword: hash,
          memberStatus: MemberStatus.ACTIVE,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("Upserted user:", user.memberNick);
  }

  await mongoose.disconnect();
  console.log("Seed users completed");
}

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
