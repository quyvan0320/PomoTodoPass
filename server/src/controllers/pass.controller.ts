import { prisma } from "@/lib/prisma";
import { passService } from "@/services/pass.service";
import { AuthRequest } from "@/types";
import { Response, NextFunction } from "express";

export const passController = {
  async getToday(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const pass = await passService.getTodayPass(req.user!.id);
      res.status(200).json({ success: true, data: pass ?? null });
    } catch (error) {
      next(error);
    }
  },
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { tasks } = req.body;
      if (!tasks?.length) {
        return res
          .status(400)
          .json({ success: false, message: "At least one task is required!" });
      }
      const pass = await passService.createTodayPass(
        req.user!.id,
        tasks,
        req.user!.streakCount,
      );
      res.status(200).json({ success: true, data: pass });
    } catch (error) {
      next(error);
    }
  },
};
