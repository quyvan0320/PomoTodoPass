import { prisma } from "@/lib/prisma";
import { AppError } from "@/middlewares/errorHandler";

export const statsService = {
  async getWeekly(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const passes = await prisma.dailyPass.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
      include: { tasks: { select: { status: true, actualMinutes: true } } },
      orderBy: { date: "asc" },
    });

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setUTCDate(d.getUTCDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("vi-VN", {
        weekday: "short",
        timeZone: "UTC",
      });
      const pass = passes.find(
        (p) => p.date.toISOString().split("T")[0] === dateStr,
      );

      if (!pass)
        return {
          date: dateStr,
          label,
          focusMinutes: 0,
          tasksDone: 0,
          tasksTotal: 0,
          completionRate: 0,
          status: "NO_PASS",
        };

      return {
        date: dateStr,
        label,
        focusMinutes: pass.tasks.reduce(
          (s, t) => s + (t.actualMinutes ?? 0),
          0,
        ),
        tasksDone: pass.tasks.filter((t) => t.status === "DONE").length,
        tasksTotal: pass.tasks.length,
        completionRate: pass.completionRate,
        status: pass.status,
      };
    });

    return {
      days,
      summary: {
        totalFocusMinutes: days.reduce((s, d) => s + d.focusMinutes, 0),
        avgCompletion: Math.round(
          days.reduce((s, d) => s + d.completionRate, 0) / 7,
        ),
        activeDays: days.filter((d) => d.status !== "NO_PASS").length,
      },
    };
  },
  async getOverview(userId: string) {
    const [user, pomodorosDone, tasksDone] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { totalTimepoints: true, streakCount: true },
      }),
      prisma.pomodoroSession.count({ where: { userId, completed: true } }),
      prisma.task.count({ where: { status: "DONE", pass: { userId } } }),
    ]);

    return {
      totalTimepoints: user?.totalTimepoints ?? 0,
      streakCount: user?.streakCount ?? 0,
      pomodorosDone,
      tasksDone,
    };
  },
};
