import { Router } from "express";
import Member from "../schema/Member.model";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await Member.find({});
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await Member.findById(req.params.id);
  res.json(user);
});

export default router;
