import { statsController } from "@/controllers/stats.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/weekly", authenticate, statsController.weekly);
router.get("/overview", authenticate, statsController.overview);

export default router;
