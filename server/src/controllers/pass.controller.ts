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
};
