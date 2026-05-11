import { timepointController } from "@/controllers/timepoint.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/balance", authenticate, timepointController.getBalance);
router.get("/history", authenticate, timepointController.getHistory);

export default router;
