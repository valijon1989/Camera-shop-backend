import express from "express";
import adminController from "./controllers/admin.controller";
import AuthService from "./models/Auth.service";
import MemberService from "./models/Member.service";
import { MemberType } from "./libs/enums/member.enum";
import uploader from "./libs/utils/uploader";
import { HttpCode } from "./libs/Errors";

const routerAdmin = express.Router();
const authService = new AuthService();
const memberService = new MemberService();

// Middleware to ensure only logged-in admin can access protected admin pages
async function requireAdminSSR(req: any, res: any, next: any) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.redirect("/admin/login");
    const member = await authService.checkAuth(token);
    if (!member || member.memberType !== MemberType.ADMIN) {
      return res.redirect("/admin/login");
    }
    req.member = member;
    next();
  } catch (err) {
    return res.redirect("/admin/login");
  }
}

routerAdmin.get("/login", async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    if (token) {
      const member = await authService.checkAuth(token);
      if (member?.memberType === MemberType.ADMIN) return res.redirect("/admin");
    }
  } catch (err) {
    // ignore and show login page
  }

  const existingAdmin = await memberService.findExistingAdmin();
  if (!existingAdmin) return res.redirect("/admin/signup");
  return res.render("login", { message: null });
});

routerAdmin.post("/login", async (req, res) => {
  try {
    console.log("POST /admin/login body:", req.body);
    const member = await memberService.processLogin({
      memberNick: req.body.memberNick || req.body.username || req.body.phone,
      memberPassword: req.body.memberPassword || req.body.password,
    });
    if (member.memberType !== MemberType.ADMIN) {
      return res
        .status(403)
        .render("login", { message: "Only admin can access this panel." });
    }
    const token = await authService.createToken(member);
    res.cookie("accessToken", token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 6 });
    return res.redirect("/admin");
  } catch (err: any) {
    console.error("Admin login failed:", err);
    const msg =
      err?.message || "Wrong credentials. Admin already exists and must login.";
    return res.status(401).render("login", { message: msg });
  }
});

// Admin signup page (only when no admin exists)
routerAdmin.get("/signup", async (_req, res) => {
  const existingAdmin = await memberService.findExistingAdmin();
  if (existingAdmin)
    return res
      .status(HttpCode.FORBIDDEN)
      .render("login", { message: "Admin already exists. Please login." });
  return res.render("signup", { message: null });
});

routerAdmin.post(
  "/signup",
  uploader("members").single("memberImage"),
  async (req, res) => {
    try {
      const existingAdmin = await memberService.findExistingAdmin();
      if (existingAdmin)
        return res
          .status(HttpCode.FORBIDDEN)
          .render("login", { message: "Admin already exists. Please login." });

      const memberImage = req.file ? req.file.path.replace(/\\/g, "/") : undefined;
      const member = await memberService.processSignup({
        memberNick: req.body.memberNick,
        memberPhone: req.body.memberPhone,
        memberPassword: req.body.memberPassword,
        memberImage,
        memberAddress: req.body.memberAddress,
        memberDesc: req.body.memberDesc,
      });

      const token = await authService.createToken(member);
      res.cookie("accessToken", token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 6 });
      return res.redirect("/admin");
    } catch (err: any) {
      const msg = err?.message || "Signup failed. Please try again.";
      return res.status(400).render("signup", { message: msg });
    }
  }
);

routerAdmin.get("/", requireAdminSSR, (req, res) => {
  adminController.dashboard(req, res);
});
routerAdmin.get("/products", requireAdminSSR, (req, res) => {
  adminController.products(req, res);
});
routerAdmin.get("/user/all", requireAdminSSR, (req, res) => {
  adminController.users(req, res);
});
// Legacy path redirect
routerAdmin.get("/product/all", (_req, res) => res.redirect("/admin/products"));
routerAdmin.post(
  "/profile",
  requireAdminSSR,
  uploader("members").single("memberImage"),
  async (req, res) => {
    try {
      const MemberService = (await import("./models/Member.service")).default;
      const memberService = new MemberService();
      const input: any = {
        memberNick: req.body.memberNick,
        memberPhone: req.body.memberPhone,
        memberAddress: req.body.memberAddress,
        memberDesc: req.body.memberDesc,
      };
      if (req.file) input.memberImage = req.file.path.replace(/\\/g, "/");
      await memberService.updateMember((req as any).member, input);
      res.redirect("/admin?msg=Profile updated");
    } catch (err) {
      console.error("Admin profile update error:", err);
      res.redirect("/admin?msg=Profile update failed");
    }
  }
);
routerAdmin.post("/user/edit", requireAdminSSR, async (req, res) => {
  try {
    const MemberService = (await import("./models/Member.service")).default;
    const memberService = new MemberService();
    const updated = await memberService.updateChosenUser({
      _id: req.body._id,
      memberStatus: req.body.memberStatus,
    } as any);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Admin user edit error:", err);
    res.status(400).json({ success: false, message: "Failed to update user" });
  }
});
// Simple logout: destroy session if exists, then redirect home
routerAdmin.get("/logout", (req, res) => {
  res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
  if (req.session) {
    req.session.destroy(() => {
      res.redirect("/admin/login");
    });
  } else {
    res.redirect("/admin/login");
  }
});

export default routerAdmin;
