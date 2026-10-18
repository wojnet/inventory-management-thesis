import { prisma } from "@/lib/prisma";

export type DashboardSummary = {
  activeItemCount: number;
  totalQuantity: number;
  recentEvents: Array<{
    id: string;
    description: string | null;
    createdAt: string;
    actorName: string | null;
  }>;
};

export const getDashboardSummary = async (
  warehouseId: string,
): Promise<DashboardSummary> => {
  const [items, recentEvents] = await Promise.all([
    prisma.item.aggregate({
      where: {
        warehouseId,
        archivedAt: null,
      },
      _count: {
        _all: true,
      },
      _sum: {
        quantity: true,
      },
    }),
    prisma.changeEvent.findMany({
      where: {
        warehouseId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        description: true,
        createdAt: true,
        actorUser: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    activeItemCount: items._count._all,
    totalQuantity: Number(items._sum.quantity ?? 0),
    recentEvents: recentEvents.map((event) => ({
      id: event.id,
      description: event.description,
      createdAt: event.createdAt.toISOString(),
      actorName: event.actorUser?.name ?? null,
    })),
  };
};
