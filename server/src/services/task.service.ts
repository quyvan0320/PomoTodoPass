import { prisma } from "@/lib/prisma";
import { AppError } from "@/middlewares/errorHandler";

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
};
