import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";
import { Session } from "express-session";
import { Request } from "express";

export interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  email?: string;
  memberPassword?: string;
  memberImage?: string;
  memberPoints?: number;
  productsSold?: number;
  productsBought?: number;
  likesCount?: number;
  rating?: number;
  memberAddress?: string;
  memberDesc: string;
  createdAt: Date;
  updatedAt: Date;
}

//Front end dan kelayotgan malumotlarimizni MemberInputga joyladilk
export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  email?: string;
  memberPassword: string;
  memberImage?: string;
  memberPoints?: number;
  productsSold?: number;
  productsBought?: number;
  likesCount?: number;
  rating?: number;
  memberAddress?: string;
  memberDesc?: string;
}

export interface LoginInput {
  memberNick?: string;
  memberPhone?: string;
  email?: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  _id: ObjectId;
  memberStatus?: MemberStatus;
  memberNick?: string;
  memberPhone?: string;
  email?: string;
  memberPassword?: string;
  memberImage?: string;
  productsSold?: number;
  productsBought?: number;
  likesCount?: number;
  rating?: number;
  memberAddress?: string;
  memberDesc?: string;
}

export interface ExtendedRequest extends Request {
  member: Member;
  file: Express.Multer.File;
  files: Express.Multer.File[];
}

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
  file: Express.Multer.File;
  files: Express.Multer.File[];
}
