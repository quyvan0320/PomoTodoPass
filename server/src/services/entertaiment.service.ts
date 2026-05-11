import { prisma } from "@/lib/prisma";
import { AppError } from "@/middlewares/errorHandler";

export const entertaimentService = {
  async redeem(userId: string, minutes: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalTimepoints: true },
    });
    if (!user) throw new AppError("User does not exist!", 404);

    if (user.totalTimepoints < minutes) {
      throw new AppError(
        `Not enough points. Given: ${user.totalTimepoints}, needed: ${minutes}`,
        400,
      );
    }

    return prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { totalTimepoints: { decrement: minutes } },
      });

      const session = await tx.entertainmentSession.create({
        data: {
          userId,
          pointsSpent: minutes,
          minutesGranted: minutes,
          expiresAt: new Date(Date.now() + minutes * 60 * 1000),
        },
      });

      await tx.timepointLog.create({
        data: {
          userId,
          amount: -minutes,
          type: "ENTERTAINMENT",
          description: `Convert ${minutes} minutes of entertainment!`,
          refId: session.id,
        },
      });
      return session;
    });
  },

  async getActive(userId: string) {
    return prisma.entertainmentSession.findFirst({
      where: { userId, status: "ACTIVE", expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  },

  async expire(sessionId: string, userId: string) {
    const session = await prisma.entertainmentSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new AppError("Session does not exist!", 404);

    return prisma.entertainmentSession.update({
      where: { id: sessionId },
      data: { status: "EXPIRED" },
    });
  },
};
