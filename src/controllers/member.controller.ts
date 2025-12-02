import express, { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import {
  ExtendedRequest,
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import MemberService from "../models/Member.service";
import Errors, { HttpCode, Message } from "../libs/Errors";
import AuthSevice from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";
import bcrypt from "bcryptjs";
//REACT
const memberService = new MemberService();
const authSevice = new AuthSevice();
const memberController: T = {};

memberController.getRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("getRestaurant");
    const result = await memberService.getRestaurant();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getRestaurant:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signup body:", req.body);
    const input: MemberInput = req.body;
    if (!input.memberNick || !input.memberPhone || !input.memberPassword) {
      return res.status(HttpCode.BAD_REQUEST).json({
        success: false,
        message: "Nickname, phone and password are required.",
      });
    }

    const existingAdmin = await memberService.findExistingAdmin();
    const isAdminRequest = input.memberType === MemberType.ADMIN;
    if (isAdminRequest && existingAdmin) {
      return res.status(HttpCode.FORBIDDEN).json({
        success: false,
        message: "Admin already exists. Only existing admin can login.",
      });
    }

    const memberType = isAdminRequest
      ? MemberType.ADMIN
      : MemberType.USER;

    const result: Member = await memberService.signup({
      ...input,
      memberType,
      memberStatus: MemberStatus.ACTIVE,
    });
    const token = await authSevice.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, signup:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// Dedicated admin signup (JSON) for API clients; keeps single-admin policy
memberController.adminSignup = async (req: Request, res: Response) => {
  try {
    const input: MemberInput = req.body;
    const existingAdmin = await memberService.findExistingAdmin();
    if (existingAdmin) {
      return res.status(HttpCode.FORBIDDEN).json({
        success: false,
        message: "Admin already exists. Only existing admin can login.",
      });
    }
    const result: Member = await memberService.signup({
      ...input,
      memberType: MemberType.ADMIN,
      memberStatus: MemberStatus.ACTIVE,
    });
    const token = await authSevice.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, adminSignup:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = req.body;
    const result = await memberService.login(input);
    const token = await authSevice.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.OK).json({
      success: true,
      message: "Logged in successfully",
      member: result,
      data: result,
      accessToken: token,
    });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// API admin login (JSON) to match SPA expectations
memberController.adminLogin = async (req: Request, res: Response) => {
  try {
    const memberNick = (req.body.memberNick || req.body.username || req.body.phone) as
      | string
      | undefined;
    const memberPassword = (req.body.memberPassword || req.body.password) as
      | string
      | undefined;
    const result = await memberService.processLogin(
      {
        memberNick: memberNick || "",
        memberPhone: memberNick,
        memberPassword: memberPassword || "",
      },
      true
    );
    if (result.memberType !== MemberType.ADMIN)
      throw new Errors(HttpCode.FORBIDDEN, Message.FORBIDDEN);

    const token = await authSevice.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.OK).json({
      success: true,
      message: "Logged in successfully",
      member: result,
      accessToken: token,
    });
  } catch (err) {
    console.log("Error, adminLogin:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    if (req.session) {
      req.session.destroy(() => {
        res.status(HttpCode.OK).json({
          success: true,
          message: "Logged out. Please login to continue.",
          redirect: "/admin/login",
        });
      });
    } else {
      res.status(HttpCode.OK).json({
        success: true,
        message: "Logged out. Please login to continue.",
        redirect: "/admin/login",
      });
    }
  } catch (err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getMemberDetail = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    console.log("getMemberDetail");
    const result = await memberService.getMemberDetail(req.member);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMemberDetail:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateMember");
    const body = req.body || {};

    const input: Partial<MemberUpdateInput> = {};
    if (body.memberNick !== undefined) {
      const nick = String(body.memberNick).trim();
      if (nick) input.memberNick = nick;
    }
    if (body.memberPhone !== undefined) {
      const phone = String(body.memberPhone).trim();
      if (phone) input.memberPhone = phone;
    }
    // Optional may be emptied by user, shuning uchun undefined bo'lmasa yozamiz
    if (body.memberAddress !== undefined) input.memberAddress = String(body.memberAddress).trim();
    if (body.memberDesc !== undefined) input.memberDesc = String(body.memberDesc).trim();
    if (body.email !== undefined) input.email = String(body.email).trim();
    if (body.newPassword !== undefined || body.memberPassword !== undefined) {
      const plain = String(body.newPassword ?? body.memberPassword);
      if (plain.trim()) {
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(plain, salt);
      }
    }

    if (req.file) input.memberImage = req.file.path.replace(/\\/g, "/");

    const result = await memberService.updateMember(req.member, input as MemberUpdateInput);

    const sessionInstance = req.session as any;
    const sanitized = (result as any).toObject ? (result as any).toObject() : result;
    if (sanitized?.memberPassword) delete sanitized.memberPassword;
    if (sessionInstance) sessionInstance.member = sanitized;

    res.status(HttpCode.OK).json({ success: true, member: sanitized, data: sanitized });
  } catch (err: any) {
    console.log("Error, updateMember:", err);
    const duplicateKey =
      err instanceof Errors
        ? null
        : err?.code === 11000 ||
          err?.codeName === "DuplicateKey" ||
          (typeof err?.message === "string" && err.message.includes("E11000"));

    if (err instanceof Errors) res.status(err.code).json(err);
    else if (duplicateKey)
      res
        .status(HttpCode.BAD_REQUEST)
        .json(new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE));
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.uploadAvatar = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    const memberImage = req.file.path.replace(/\\/g, "/");
    res.status(HttpCode.OK).json({ memberImage });
  } catch (err) {
    console.log("Error, uploadAvatar:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getTopUsers = async (req: Request, res: Response) => {
  try {
    console.log("getTopUsers");
    const result = await memberService.getTopUsers();

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getTopUsers:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers["authorization"];
    const headerToken =
      bearer && bearer.toString().startsWith("Bearer ")
        ? bearer.toString().slice(7)
        : null;
    const token = headerToken || req.cookies["accessToken"];
    if (token) req.member = await authSevice.checkAuth(token);

    if (!req.member)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    next();
  } catch (err) {
    console.log("Error, verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authSevice.checkAuth(token);
    next();
  } catch (err) {
    console.log("Error, verifyAuth:", err);
    next();
  }
};

memberController.requireAdmin = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.member?.memberType !== MemberType.ADMIN)
      throw new Errors(HttpCode.FORBIDDEN, Message.FORBIDDEN);
    next();
  } catch (err) {
    console.log("Error, requireAdmin:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.requireAgentOrAdmin = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Allow any authenticated member (USER/AGENT/ADMIN) to proceed
    if (!req.member) throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    next();
  } catch (err) {
    console.log("Error, requireAgentOrAdmin:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.blockMember = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await memberService.changeStatus(id, MemberStatus.BLOCK);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, blockMember:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.deleteMember = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await memberService.changeStatus(id, MemberStatus.DELETE);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, deleteMember:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default memberController;
