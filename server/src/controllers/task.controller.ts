import { taskService } from "@/services/task.service";
import { AuthRequest } from "@/types";
import { Response, NextFunction } from "express";

export const taskController = {
  async start(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId: string = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const userId = req.user!.id;
      const duration = req.body.durationMinutes ?? 50;
      const result = await taskService.startTask(taskId, userId, duration);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
