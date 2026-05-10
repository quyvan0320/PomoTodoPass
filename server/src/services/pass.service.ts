import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/utils/string.util";

export const passService = {
  async getTodayPass(userId: string) {
    return prisma.dailyPass.findFirst({
      where: { userId, date: todayUTC() },
      include: { tasks: { orderBy: { order: "asc" } } },
    });
  },
};
