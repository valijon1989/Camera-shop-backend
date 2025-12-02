import Errors, { Message } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { HttpCode } from "../libs/Errors";

class AuthSevice {
  private readonly secretToken;
  constructor() {
    this.secretToken =
      (process.env.SECRET_TOKEN as string | undefined) || "camera-shop-secret";
  }

  public async createToken(payload: Member): Promise<string> {
    const safePayload = {
      _id:
        // normalize ObjectId to string for token payload
        (payload as any)?._id?.toString?.() ?? (payload as any)?._id ?? null,
      memberNick: payload.memberNick,
      memberPhone: payload.memberPhone,
      memberType: payload.memberType,
      memberStatus: payload.memberStatus,
    };

    const secret = this.secretToken || "camera-shop-secret";
    const duration = `${AUTH_TIMER}h`;

    try {
      const token = jwt.sign(safePayload, secret, { expiresIn: duration });
      return Promise.resolve(token);
    } catch (err) {
      return Promise.reject(
        new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
      );
    }
  }

  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token,
      this.secretToken
    )) as Member;
    console.log(`----AUTH jarayon: ${result.memberNick} ---`);
    return result;
  }
}

export default AuthSevice;
