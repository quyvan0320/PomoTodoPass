import { prisma } from "@/lib/prisma";
import { entertaimentService } from "@/services/entertaiment.service";
import { AuthRequest } from "@/types";
import { Response, NextFunction } from "express";

export const entertaimentController = {
  async redeem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { minutes } = req.body;
      if (!minutes || minutes < 10) {
        return res
          .status(400)
          .json({ success: false, message: "Convert on 30 minutes!" });
      }
      const userId = req.user!.id;
      const session = await entertaimentService.redeem(userId, minutes);
      res.status(200).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  },
};
