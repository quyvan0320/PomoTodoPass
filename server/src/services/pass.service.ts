import { prisma } from "@/lib/prisma";
import { AppError } from "@/middlewares/errorHandler";
import { CreateTaskItem, POINTS_MAP, STREAK_THRESHOLD } from "@/types";
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

    const debuffActive = yesterdayPass
      ? yesterdayPass.completionRate < 70
      : false;
    const multiplier = streakCount >= STREAK_THRESHOLD ? STREAK_THRESHOLD : 1.0;

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
