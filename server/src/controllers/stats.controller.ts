import { prisma } from "@/lib/prisma";
import { statsService } from "@/services/stats.service";
import { AuthRequest } from "@/types";
import { NextFunction, Response } from "express";

export const statsController = {
  async weekly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await statsService.getWeekly(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async overview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await statsService.getOverview(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
