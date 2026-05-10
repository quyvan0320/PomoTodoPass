import { Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import admin from "@/lib/firebase";
import { prisma } from "@/lib/prisma";
import { AuthRequest } from "@/types";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Missing Authorization header!", 401);
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email ?? "",
        displayName: decoded.name ?? null,
        avatarUrl: decoded.picture ?? null,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email ?? "",
        displayName: decoded.name ?? null,
        avatarUrl: decoded.picture ?? null,
      },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        displayName: true,
        totalTimepoints: true,
        streakCount: true,
      },
    });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
