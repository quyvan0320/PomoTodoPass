import { passController } from "@/controllers/pass.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/today", authenticate, passController.getToday);

export default router;
