import { prisma } from "@/lib/prisma";
import { AuthRequest } from "@/types";
import { NextFunction, Response } from "express";

export const timepointController = {
  async getBalance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: req.user!.id },
        select: { totalTimepoints: true, streakCount: true },
      });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const [logs, total] = await Promise.all([
        prisma.timepointLog.findMany({
          where: { userId: req.user!.id },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            amount: true,
            type: true,
            description: true,
            createdAt: true,
          },
        }),
        prisma.timepointLog.count({ where: { userId: req.user!.id } }),
      ]);
      res
        .status(200)
        .json({
          success: true,
          data: logs,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
    } catch (error) {
      next(error);
    }
  },
};
