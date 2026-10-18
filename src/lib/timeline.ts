import { prisma } from "@/lib/prisma";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type TimelineEntry = {
  id: string;
  itemId: string | null;
  changeType: "CREATE" | "UPDATE" | "ARCHIVE" | "RESTORE";
  fieldPath: string;
  beforeValue: JsonValue;
  afterValue: JsonValue;
  createdAt: string;
};

export type TimelineEventListItem = {
  id: string;
  source: "MANUAL" | "ACTION" | "AI" | "RESTORE";
  description: string | null;
  note: string | null;
  createdAt: string;
  actorName: string | null;
  actionName: string | null;
  entryCount: number;
};

export type TimelineEventItem = TimelineEventListItem & {
  restoredEventId: string | null;
  entries: TimelineEntry[];
};

const formatJsonValue = (value: unknown): JsonValue => {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(formatJsonValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(
        ([key, entryValue]) => [key, formatJsonValue(entryValue)],
      ),
    );
  }

  return String(value);
};

export const getTimelineEvents = async (
  warehouseId: string,
): Promise<TimelineEventListItem[]> => {
  const events = await prisma.changeEvent.findMany({
    where: {
      warehouseId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      source: true,
      description: true,
      note: true,
      createdAt: true,
      actorUser: {
        select: {
          name: true,
        },
      },
      action: {
        select: {
          name: true,
        },
      },
      entries: {
        select: {
          id: true,
        },
      },
    },
  });

  return events.map((event) => ({
    id: event.id,
    source: event.source,
    description: event.description,
    note: event.note,
    createdAt: event.createdAt.toISOString(),
    actorName: event.actorUser?.name ?? null,
    actionName: event.action?.name ?? null,
    entryCount: event.entries.length,
  }));
};

export const getTimelineEvent = async (
  eventId: string,
  warehouseId: string,
): Promise<TimelineEventItem | null> => {
  const event = await prisma.changeEvent.findFirst({
    where: {
      id: eventId,
      warehouseId,
    },
    select: {
      id: true,
      source: true,
      description: true,
      note: true,
      createdAt: true,
      restoredEventId: true,
      actorUser: {
        select: {
          name: true,
        },
      },
      action: {
        select: {
          name: true,
        },
      },
      entries: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          itemId: true,
          changeType: true,
          fieldPath: true,
          beforeValue: true,
          afterValue: true,
          createdAt: true,
        },
      },
    },
  });

  if (!event) {
    return null;
  }

  return {
    id: event.id,
    source: event.source,
    description: event.description,
    note: event.note,
    createdAt: event.createdAt.toISOString(),
    restoredEventId: event.restoredEventId,
    actorName: event.actorUser?.name ?? null,
    actionName: event.action?.name ?? null,
    entryCount: event.entries.length,
    entries: event.entries.map((entry) => ({
      id: entry.id,
      itemId: entry.itemId,
      changeType: entry.changeType,
      fieldPath: entry.fieldPath,
      beforeValue: formatJsonValue(entry.beforeValue),
      afterValue: formatJsonValue(entry.afterValue),
      createdAt: entry.createdAt.toISOString(),
    })),
  };
};
