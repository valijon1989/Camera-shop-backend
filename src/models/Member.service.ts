import MemberModel from "../schema/Member.model";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";
import { shapeIntroMongooseObjectId } from "../libs/config";

class MemberService {
  logout(input: LoginInput) {
    throw new Error("Method not implemented.");
  }
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }
  public async findExistingAdmin() {
    return this.memberModel.findOne({
      memberType: MemberType.ADMIN,
      memberStatus: { $ne: MemberStatus.DELETE },
    });
  }
  /* SPA */
  public async getRestaurant(): Promise<Member> {
    // legacy naming: returns ADMIN if exists
    const result = await this.memberModel
      .findOne({
        memberType: MemberType.ADMIN,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();
    } catch (err) {
      console.error("Error, model: signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const loginId = input.memberNick || input.memberPhone;
    if (!loginId || !input.memberPassword)
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    const member = await this.memberModel
      .findOne({
        memberStatus: { $ne: MemberStatus.DELETE }, //FILTER // delete bolgan userni login bolishiga izin bermaydi
        $or: [
          { memberNick: loginId },
          { memberPhone: loginId },
        ],
      })
      .select("+memberPassword") // memberPasswordni ham qoshib ber degani,
      .exec(); //PROJECTION
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    } //statusi block bolganlarni login qilishiga taqiq

    const isMatch: boolean = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    return await this.memberModel.findById(member._id).lean().exec();
    //lean() dokument type malumotni js objectga aylantirirb beradi
  }

  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntroMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async updateMember(
    member: Member,
    input: MemberUpdateInput
  ): Promise<Member> {
    const memberId = shapeIntroMongooseObjectId(member._id);

    // Uniqueness check to avoid duplicate key errors on memberNick / memberPhone
    if (input.memberNick) {
      const nickOwner = await this.memberModel
        .findOne({ memberNick: input.memberNick, _id: { $ne: memberId } })
        .lean()
        .exec();
      if (nickOwner) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
      }
    }
    if (input.memberPhone) {
      const phoneOwner = await this.memberModel
        .findOne({ memberPhone: input.memberPhone, _id: { $ne: memberId } })
        .lean()
        .exec();
      if (phoneOwner) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
      }
    }

    try {
      const result = await this.memberModel
        .findOneAndUpdate({ _id: memberId }, input, { new: true })
        .exec();
      if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
      return result;
    } catch (err: any) {
      // Fallback for any other duplicate index errors
      const isDuplicate =
        err?.code === 11000 ||
        err?.codeName === "DuplicateKey" ||
        (typeof err?.message === "string" && err.message.includes("E11000"));
      if (isDuplicate) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
      }
      throw err;
    }
  }

  public async getTopUsers(): Promise<Member[]> {
    // "Active Agents & Creators" uchun faqat AGENTlarni olish,
    // point talabini olib tashladik, sorting: rating -> memberPoints -> createdAt
    const result = await this.memberModel
      .find({
        memberStatus: MemberStatus.ACTIVE,
        memberType: MemberType.AGENT,
      })
      .sort({ rating: -1, memberPoints: -1, createdAt: -1 })
      .limit(4)
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async addUserPoint(member: Member, point: number): Promise<Member> {
    const memberId = shapeIntroMongooseObjectId(member._id);

    return await this.memberModel
      .findByIdAndUpdate(
        {
          _id: memberId,
          MemberType: MemberType.USER,
          memberStatus: MemberStatus.ACTIVE,
        },
        { $inc: { memberPoints: point } },
        { new: true }
      )
      .exec();
  }

  public async changeStatus(
    memberId: string,
    status: MemberStatus
  ): Promise<Member> {
    const id = shapeIntroMongooseObjectId(memberId);
    const result = await this.memberModel
      .findOneAndUpdate(
        { _id: id },
        { memberStatus: status },
        { new: true }
      )
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  /* SSR */
  //DEFINE
  public async processSignup(input: MemberInput): Promise<Member> {
    if (!input.memberNick || !input.memberPhone || !input.memberPassword) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(input.memberPassword, salt);

    // console.log("after", input.memberPassword);
    try {
      const filter = {
        $or: [
          { memberNick: input.memberNick },
          { memberPhone: input.memberPhone },
        ],
      };

      const update = {
        $set: {
          memberNick: input.memberNick,
          memberPhone: input.memberPhone,
          memberPassword: hashedPassword,
          memberType: MemberType.ADMIN,
          memberStatus: MemberStatus.ACTIVE,
          memberImage: input.memberImage,
          memberAddress: input.memberAddress,
          memberDesc: input.memberDesc,
        },
      };

      const result = await this.memberModel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });

      if (result) result.memberPassword = "";
      return result as Member;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      /* try{} catch{} qilib,  customized class hosil qilib
       errorlarimizni hosil qilib shu yerga throw qilyapmiz, 
       maqsadi front end chilarga qulay erroy chiqaradi, oqishga qulay*/
    }
  }

  public async processLogin(input: LoginInput, requireAdmin = false): Promise<Member> {
    const loginId = input.memberNick || input.memberPhone;
    console.log("processLogin loginId:", loginId, "requireAdmin:", requireAdmin);
    const member = await this.memberModel
      .findOne({
        $or: [
          { memberNick: loginId },
          { memberPhone: loginId },
        ],
        ...(requireAdmin ? { memberType: MemberType.ADMIN } : {}),
      })
      .select("+memberPassword") // memberPasswordni ham qoshib ber degani,
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch: boolean = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );
    console.log("processLogin isMatch:", isMatch);

    // const isMatch = input.memberPassword === member.memberPassword;

    // console.log("matching", isMatch);
    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    return await this.memberModel.findById(member._id).exec();
    // console.log("member:", member);
    // return member;
  }

  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: { $in: [MemberType.USER, MemberType.AGENT] } })
      .select(
        "memberNick memberPhone memberImage memberType memberStatus memberPoints productsSold productsBought likesCount rating"
      )
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntroMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate(
        {
          _id: input._id,
        }, // filter
        input, // update data
        { new: true }
      ) // updated new data
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }
}

export default MemberService;
