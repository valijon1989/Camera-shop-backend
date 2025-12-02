import { Router } from "express";
import { createHelpRequest } from "../controllers/help.controller";

const router = Router();

router.post("/", createHelpRequest);

export default router;
