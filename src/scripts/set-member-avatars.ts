import dotenv from "dotenv";
import mongoose from "mongoose";
import MemberModel from "../schema/Member.model";
import { MemberStatus } from "../libs/enums/member.enum";

dotenv.config();

const avatarFiles = [
  "uploads/members/avatar-1.jpg",
  "uploads/members/avatar-2.jpg",
  "uploads/members/avatar-3.jpg",
  "uploads/members/avatar-4.jpg",
  "uploads/members/avatar-5.jpg",
  "uploads/members/avatar-6.jpg",
  "uploads/members/avatar-7.jpg",
  "uploads/members/avatar-8.jpg",
  "uploads/members/avatar-9.jpg",
  "uploads/members/avatar-10.jpg",
  "uploads/members/avatar-11.jpg",
  "uploads/members/avatar-12.jpg",
];

async function run() {
  const url =
    process.env.MONGO_CAMERA_SHOP_URL ||
    process.env.MONGO_URL ||
    "mongodb://127.0.0.1:27017/camera_shop";

  await mongoose.connect(url);

  const members = await MemberModel.find({
    memberStatus: { $ne: MemberStatus.DELETE },
  })
    .sort({ createdAt: 1 })
    .select("_id memberNick")
    .lean();

  if (members.length > avatarFiles.length) {
    throw new Error(
      `Avatarlar yetarli emas: ${members.length} ta user, ${avatarFiles.length} ta avatar mavjud.`
    );
  }

  for (let i = 0; i < members.length; i++) {
    const avatar = avatarFiles[i];
    await MemberModel.updateOne({ _id: members[i]._id }, { $set: { memberImage: avatar } });
  }

  console.log(`Yangilandi: ${members.length} ta foydalanuvchi uchun avatar o'rnatildi.`);
  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
