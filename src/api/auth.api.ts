import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Member from "../schema/Member.model";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

const router = Router();

router.post("/signup", async (req, res): Promise<void> => {
  try {
    console.log("API signup body:", req.body);
    const { memberNick, memberPassword, memberPhone, email } = req.body;
    if (!memberNick || !memberPassword) {
      res
        .status(400)
        .json({ success: false, message: "memberNick and password are required" });
      return;
    }

    const phoneValue =
      memberPhone ||
      `${memberNick}-${Date.now().toString().slice(-6)}`; // fallback so schema requirement is satisfied and unique-ish

    const hashed = await bcrypt.hash(memberPassword, 10);

    const user = await Member.create({
      memberNick,
      memberPhone: phoneValue,
      email: email || undefined,
      memberPassword: hashed,
      memberType: MemberType.USER,
      memberStatus: MemberStatus.ACTIVE,
    });

    const token = jwt.sign(
      { id: user._id, nick: user.memberNick },
      process.env.SECRET_TOKEN || "camera-shop-secret",
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({
      success: true,
      token,
      data: {
        _id: user._id,
        memberNick: user.memberNick,
        memberPhone: user.memberPhone,
        memberType: user.memberType,
        memberStatus: user.memberStatus,
        memberImage: user.memberImage,
        email: user.email,
      },
      member: {
        _id: user._id,
        memberNick: user.memberNick,
        memberPhone: user.memberPhone,
        memberType: user.memberType,
        memberStatus: user.memberStatus,
        memberImage: user.memberImage,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error("API signup error:", err);
    if (err?.code === 11000) {
      res
        .status(409)
        .json({ success: false, message: "memberNick or phone already exists" });
      return;
    }
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/login", async (req, res): Promise<void> => {
  try {
    const { memberNick, memberPassword } = req.body;

    const user: any = await Member.findOne({ memberNick }).select("+memberPassword");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const match = await bcrypt.compare(memberPassword, user.memberPassword);
    if (!match) {
      res.status(401).json({ success: false, message: "Wrong password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, nick: user.memberNick },
      process.env.SECRET_TOKEN || "camera-shop-secret",
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({
      success: true,
      token,
      data: {
        _id: user._id,
        memberNick: user.memberNick,
        memberPhone: user.memberPhone,
        memberType: user.memberType,
        memberStatus: user.memberStatus,
        memberImage: user.memberImage,
        email: user.email,
      },
      member: {
        _id: user._id,
        memberNick: user.memberNick,
        memberPhone: user.memberPhone,
        memberType: user.memberType,
        memberStatus: user.memberStatus,
        memberImage: user.memberImage,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
