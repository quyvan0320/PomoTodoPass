import { taskController } from "@/controllers/task.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.patch("/:id/start",    authenticate, taskController.start);
router.patch("/:id/complete", authenticate, taskController.complete);
router.patch("/:id",          authenticate, taskController.update);
router.delete("/:id",         authenticate, taskController.remove);

export default router;
