import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
// Schema first & code first
//Schema first

//Schema oraqali object yasaymiz
const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPassword: {
      type: String,
      select: false, //by default olib berma
      required: true,
    },

    email: {
      type: String,
      index: { unique: true, sparse: true },
    },

    memberImage: {
      type: String,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },
    productsSold: {
      type: Number,
      default: 0,
    },
    productsBought: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },

    memberAddress: {
      type: String,
    },

    memberDesc: {
      type: String,
    },
  },
  { timestamps: true }
  /* updatedAt & createdAt ni qoyib beradi,
  quyida "Member" ni => members nomi bilan avtomatik
  collecton databaseda hosil boladi
  timestamps: true, collection: "collection name"
  qilish orqali collectionga ozmiz yoqqan nomni qoysak boladi*/
);

//va memberSchema validation objectidan
// quyidagi member schema modelni hosil qilamiz:
export default mongoose.model("User", memberSchema, "users");
