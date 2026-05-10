import { prisma } from "@/lib/prisma";
import { AuthRequest } from "@/types";
import { Response, NextFunction } from "express";

export const authController = {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          totalTimepoints: true,
          streakCount: true,
          lastActiveDate: true,
          createdAt: true,
        },
      });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
};
