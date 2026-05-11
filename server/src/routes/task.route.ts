import { taskController } from "@/controllers/task.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.patch("/:id/start", authenticate, taskController.start);

export default router;
