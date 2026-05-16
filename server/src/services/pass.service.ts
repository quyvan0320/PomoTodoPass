import { prisma } from "@/lib/prisma";
import { AppError } from "@/middlewares/errorHandler";
import {
  CreateTaskItem,
  POINTS_MAP,
  STREAK_MULTIPLIER,
  STREAK_THRESHOLD,
} from "@/types";
import { todayUTC, yesterdayUTC } from "@/utils/string.util";

export const passService = {
  async getTodayPass(userId: string) {
    return prisma.dailyPass.findFirst({
      where: { userId, date: todayUTC() },
      include: { tasks: { orderBy: { order: "asc" } } },
    });
  },
  async createTodayPass(
    userId: string,
    tasks: CreateTaskItem[],
    streakCount: number,
  ) {
    const existing = await prisma.dailyPass.findFirst({
      where: { userId, date: todayUTC() },
    });
    if (existing) throw new AppError("Today's Pass already exists!", 409);
    const yesterdayPass = await prisma.dailyPass.findFirst({
      where: { userId, date: yesterdayUTC() },
      select: { completionRate: true },
    });

    let newStreak: number;

    if (!yesterdayPass) {
      newStreak = 0;
    } else if (yesterdayPass.completionRate < 70) {
      newStreak = 0;
    } else {
      newStreak = streakCount + 1;
    }

    const debuffActive = yesterdayPass
      ? yesterdayPass.completionRate < 70
      : false;

    const multiplier = newStreak >= STREAK_THRESHOLD ? STREAK_MULTIPLIER : 1.0;

    await prisma.user.update({
      where: { id: userId },
      data: {
        streakCount: newStreak,
        lastActiveDate: todayUTC(),
      },
    });
    return prisma.dailyPass.create({
      data: {
        userId,
        date: todayUTC(),
        debuffActive,
        multiplier,
        commitmentChecked: true,
        tasks: {
          create: tasks.map((t, i) => ({
            title: t.title,
            difficulty: t.difficulty,
            basePoints: POINTS_MAP[t.difficulty],
            order: i,
            estimatedMinutes: t.estimatedMinutes ?? null,
          })),
        },
      },
      include: { tasks: { orderBy: { order: "asc" } } },
    });
  },
};
