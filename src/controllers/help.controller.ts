import { Request, Response } from "express";
import HelpRequestModel from "../schema/HelpRequest.model";

export const createHelpRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, phone, message } = req.body || {};
    if (!name || !email || !subject || !phone || !message) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    await HelpRequestModel.create({ name, email, subject, phone, message });

    // Adminlarga panelda bildirishnoma, oddiy foydalanuvchilarni home sahifaga qaytarish
    const member = (req as any).member;
    if (member?.memberType === "ADMIN") {
      res.redirect("/admin?msg=Help request received");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error("createHelpRequest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
