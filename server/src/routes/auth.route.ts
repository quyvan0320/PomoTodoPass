import { authController } from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/me", authenticate, authController.getMe);

export default router;
