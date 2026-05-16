import { prisma } from "@/lib/prisma";
import { AppError } from "@/middlewares/errorHandler";
import {
  COMPLETION_BONUS,
  DEBUFF_RATE,
  POINTS_MAP,
  STREAK_MULTIPLIER,
  STREAK_THRESHOLD,
  UpdateTaskContent,
} from "@/types";

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

  async completeTask(
    taskId: string,
    userId: string,
    sessionId: string,
    actualMinutes: number,
  ) {
    const task = await taskService.getOwnedTask(taskId, userId);

    if (task.status === "DONE") throw new AppError("Task completed", 400);

    const pass = task.pass;
    let points = Math.round(task.basePoints * pass.multiplier);
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
          description: `✅ Hoàn thành: ${task.title}`,
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
            description: "🎉 Hoàn thành 100% công việc hôm nay!",
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

      return {
        pointsEarned: points,
        bonusPoints,
        completionRate,
        newTotal: updatedUser.totalTimepoints,
      };
    });
  },

  async updateTask(
    taskId: string,
    userId: string,
    data: {
      title?: string;
      difficulty?: "EASY" | "MEDIUM" | "HARD";
      order?: number;
    },
  ) {
    const task = await taskService.getOwnedTask(taskId, userId);
    if (task.status !== "PENDING")
      throw new AppError("Chỉ sửa được task PENDING", 400);

    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.difficulty && {
          difficulty: data.difficulty,
          basePoints: POINTS_MAP[data.difficulty],
        }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  },

  async deleteTask(taskId: string, userId: string) {
    const task = await taskService.getOwnedTask(taskId, userId);
    if (task.status !== "PENDING")
      throw new AppError("Chỉ xóa được task PENDING", 400);
    await prisma.task.delete({ where: { id: taskId } });
  },
};
