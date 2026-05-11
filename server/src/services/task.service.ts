import { prisma } from "@/lib/prisma";
import { AppError } from "@/middlewares/errorHandler";
import { COMPLETION_BONUS, DEBUFF_RATE, STREAK_MULTIPLIER, STREAK_THRESHOLD } from "@/types";

export const taskService = {
  // check task own user
  async getOwnedTask(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId },
      include: { pass: { include: { tasks: true } } },
    });

    if (!task) throw new AppError("Task does not exist!", 404);
    if (task.pass.userId !== userId) throw new AppError("No access!", 403);
    return task;
  },
  async startTask(taskId: string, userId: string, durationMinutes: number) {
    const task = await taskService.getOwnedTask(taskId, userId);

    if (task.status === "DONE") throw new AppError("Task completed", 400);

    const [updatedTask, session] = await prisma.$transaction([
      prisma.task.update({
        where: { id: taskId },
        data: { status: "IN_PROGRESS" },
      }),
      prisma.pomodoroSession.create({
        data: { taskId, userId, durationMinutes },
      }),
    ]);

    return { task: updatedTask, session };
  },

  //   streak logic
  async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakCount: true, lastActiveDate: true },
    });
    if (!user) return;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let newStreak = 1;
    if (user.lastActiveDate) {
      const last = new Date(user.lastActiveDate);
      last.setUTCHours(0, 0, 0, 0);
      const diffDays = Math.round(
        (today.getTime() - last.getTime()) / 86_400_000,
      );
      if (diffDays === 0) return;
      if (diffDays === 1) newStreak = user.streakCount + 1;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { streakCount: newStreak, lastActiveDate: today },
    });

    if (newStreak % STREAK_THRESHOLD === 0) {
      await prisma.timepointLog.create({
        data: {
          userId,
          amount: 0,
          type: "STREAK_BONUS",
          description: `${newStreak} consecutive days! Get your points tomorrow ×${STREAK_MULTIPLIER}!`,
        },
      });
    }
  },

  async completeTask(
    taskId: string,
    userId: string,
    sessionId: string,
    actualMinutes: number,
  ) {
    const task = await taskService.getOwnedTask(taskId, userId);

    if (task.status === "DONE") throw new AppError("Task completed", 400);

    const pass = task.pass;
    let points = Math.round(task.basePoints + pass.multiplier);
    if (pass.debuffActive) points = Math.round(points * DEBUFF_RATE);

    return prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: { status: "DONE", completedAt: new Date(), actualMinutes },
      });

      await tx.pomodoroSession.update({
        where: { id: sessionId },
        data: { completed: true, pointsEarned: points, endedAt: new Date() },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { totalTimepoints: { increment: points } },
        select: { totalTimepoints: true },
      });

      await tx.timepointLog.create({
        data: {
          userId,
          amount: points,
          type: "TASK_COMPLETE",
          description: `Complete: ${task.title}`,
          refId: taskId,
        },
      });
      // cal completion rate
      const doneTasks = pass.tasks.filter(
        (t) => t.status === "DONE" || t.id === taskId,
      ).length;
      const completionRate = Math.round((doneTasks / pass.tasks.length) * 100);
      const isAllDone = doneTasks === pass.tasks.length;

      // completion bonus 100%
      let bonusPoints = 0;
      if (isAllDone && !pass.bonusGranted) {
        bonusPoints = COMPLETION_BONUS;
        await tx.user.update({
          where: { id: userId },
          data: { totalTimepoints: { increment: bonusPoints } },
        });

        await tx.timepointLog.create({
          data: {
            userId,
            amount: bonusPoints,
            type: "COMPLETION_BONUS",
            description: "Complete 100% of your task today!",
            refId: pass.id,
          },
        });
      }
      await tx.dailyPass.update({
        where: { id: pass.id },
        data: {
          completionRate,
          status: isAllDone ? "COMPLETED" : "ACTIVE",
          bonusGranted: isAllDone ? true : pass.bonusGranted,
        },
      });

      await taskService.updateStreak(userId);

      return {
        pointsEarned: points,
        bonusPoints,
        completionRate,
        newTotal: updatedUser.totalTimepoints,
      };
    });
  },
};
