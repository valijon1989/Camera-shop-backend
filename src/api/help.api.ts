//@ts-ignore
import { Router, Request, Response } from "express";
import HelpRequestModel from "../schema/HelpRequest.model";

const helpApi = Router();

helpApi.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message, subject, phone } = req.body || {};
    if (!name || !email || !message || !subject || !phone) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    await HelpRequestModel.create({ name, email, message, subject, phone });
    res.status(200).json({ success: true, message: "Help request received" });
  } catch (err) {
    console.error("helpApi error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default helpApi;
