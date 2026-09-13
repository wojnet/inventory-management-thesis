import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_WAREHOUSE_NAME,
} from "@/lib/inventory-context";

export interface ItemListEntry {
  id: string;
  name: string;
  quantity: number;
  customAttributes: Array<{
    name: string;
    value: string;
  }>;
  lastChange: string;
}

export interface ItemDetailsEntry extends ItemListEntry {
  description: string | null;
  archivedAt: string | null;
}

export interface CreateItemInput {
  name: string;
  description?: string;
  quantity: number;
  attributes?: CreateItemAttributeInput[];
}

export interface CreateItemAttributeInput {
  name: string;
  dataType: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";
  value: string;
}

export interface UpdateItemInput {
  itemId: string;
  name: string;
  description?: string;
  quantity: number;
  attributes?: CreateItemAttributeInput[];
}

export const getDefaultWarehouse = async () => {
  return prisma.warehouse.findFirst({
    where: {
      name: DEFAULT_WAREHOUSE_NAME,
    },
    select: {
      id: true,
      name: true,
      memberships: {
        where: {
          user: {
            email: DEFAULT_ADMIN_EMAIL,
          },
        },
        select: {
          id: true,
        },
      },
    },
  });
};

function formatAttributeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

export const getItemList = async (): Promise<ItemListEntry[]> => {
  const warehouse = await getDefaultWarehouse();

  if (!warehouse) {
    return [];
  }

  const items = await prisma.item.findMany({
    where: {
      warehouseId: warehouse.id,
      archivedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      quantity: true,
      updatedAt: true,
      attributes: {
        where: {
          archivedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          name: true,
          value: true,
        },
      },
    },
  });

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: Number(item.quantity),
    customAttributes: item.attributes.map((attribute) => ({
      name: attribute.name,
      value: formatAttributeValue(attribute.value),
    })),
    lastChange: item.updatedAt.toISOString(),
  }));
};

export const getItemDetails = async (itemId: string): Promise<ItemDetailsEntry | null> => {
  const warehouse = await getDefaultWarehouse();

  if (!warehouse) {
    return null;
  }

  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      warehouseId: warehouse.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      quantity: true,
      archivedAt: true,
      updatedAt: true,
      attributes: {
        where: {
          archivedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          name: true,
          dataType: true,
          value: true,
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    quantity: Number(item.quantity),
    archivedAt: item.archivedAt?.toISOString() ?? null,
    customAttributes: item.attributes.map((attribute) => ({
      name: attribute.name,
      value: formatAttributeValue(attribute.value),
    })),
    lastChange: item.updatedAt.toISOString(),
  };
};

export const createItem = async (input: CreateItemInput) => {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Item name is required.");
  }

  if (!Number.isFinite(input.quantity) || input.quantity < 0) {
    throw new Error("Quantity must be a non-negative number.");
  }

  const warehouse = await getDefaultWarehouse();

  if (!warehouse) {
    throw new Error("Default warehouse not found.");
  }

  const attributes = (input.attributes ?? [])
    .map((attribute) => ({
      name: attribute.name.trim(),
      dataType: attribute.dataType,
      value: attribute.value.trim(),
    }))
    .filter((attribute) => attribute.name.length > 0);

  for (const attribute of attributes) {
    if (attribute.dataType === "NUMBER" && Number.isNaN(Number(attribute.value))) {
      throw new Error(`Attribute ${attribute.name} requires a valid number.`);
    }

    if (attribute.dataType === "BOOLEAN" && !["true", "false"].includes(attribute.value.toLowerCase())) {
      throw new Error(`Attribute ${attribute.name} requires true or false.`);
    }

    if (attribute.dataType === "DATE" && Number.isNaN(Date.parse(attribute.value))) {
      throw new Error(`Attribute ${attribute.name} requires a valid date.`);
    }
  }

  return prisma.$transaction(async (tx) => {
    const item = await tx.item.create({
      data: {
        warehouseId: warehouse.id,
        name,
        description: input.description?.trim() || null,
        quantity: new Prisma.Decimal(input.quantity),
      },
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    for (const attribute of attributes) {
      await tx.itemAttribute.create({
        data: {
          warehouseId: warehouse.id,
          itemId: item.id,
          name: attribute.name,
          dataType: attribute.dataType,
          value:
            attribute.dataType === "NUMBER"
              ? new Prisma.Decimal(attribute.value)
              : attribute.dataType === "BOOLEAN"
                ? attribute.value.toLowerCase() === "true"
                : attribute.dataType === "DATE"
                  ? new Date(attribute.value).toISOString()
                  : attribute.value,
        },
      });
    }

    const changeEvent = await tx.changeEvent.create({
      data: {
        warehouseId: warehouse.id,
        source: "MANUAL",
        description: `Created item ${item.name}`,
      },
      select: {
        id: true,
      },
    });

    await tx.changeEntry.create({
      data: {
        changeEventId: changeEvent.id,
        itemId: item.id,
        changeType: "CREATE",
        fieldPath: "item",
        beforeValue: Prisma.JsonNull,
        afterValue: {
          name: item.name,
          description: item.description,
          quantity: item.quantity.toString(),
        },
      },
    });

    for (const attribute of attributes) {
      await tx.changeEntry.create({
        data: {
          changeEventId: changeEvent.id,
          itemId: item.id,
          changeType: "CREATE",
          fieldPath: `attributes.${attribute.name}`,
          beforeValue: Prisma.JsonNull,
          afterValue: {
            name: attribute.name,
            dataType: attribute.dataType,
            value: attribute.value,
          },
        },
      });
    }

    await tx.warehouseSnapshot.create({
      data: {
        warehouseId: warehouse.id,
        changeEventId: changeEvent.id,
        state: {
          items: (await tx.item.findMany({
            where: {
              warehouseId: warehouse.id,
              archivedAt: null,
            },
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              name: true,
              description: true,
              quantity: true,
              archivedAt: true,
              attributes: {
                where: {
                  archivedAt: null,
                },
                orderBy: {
                  createdAt: "asc",
                },
                select: {
                  id: true,
                  name: true,
                  dataType: true,
                  value: true,
                },
              },
            },
          })).map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            quantity: Number(item.quantity),
            archivedAt: item.archivedAt,
            attributes: item.attributes.map((attribute) => ({
              id: attribute.id,
              name: attribute.name,
              dataType: attribute.dataType,
              value: attribute.value,
            })),
          })),
        },
      },
    });

    return item;
  });
};

export const updateItem = async (input: UpdateItemInput) => {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Item name is required.");
  }

  if (!Number.isFinite(input.quantity) || input.quantity < 0) {
    throw new Error("Quantity must be a non-negative number.");
  }

  const warehouse = await getDefaultWarehouse();

  if (!warehouse) {
    throw new Error("Default warehouse not found.");
  }

  const item = await prisma.item.findFirst({
    where: {
      id: input.itemId,
      warehouseId: warehouse.id,
    },
  });

  if (!item) {
    throw new Error("Item not found.");
  }

  const attributes = (input.attributes ?? [])
    .map((attribute) => ({
      name: attribute.name.trim(),
      dataType: attribute.dataType,
      value: attribute.value.trim(),
    }))
    .filter((attribute) => attribute.name.length > 0);

  for (const attribute of attributes) {
    if (attribute.dataType === "NUMBER" && Number.isNaN(Number(attribute.value))) {
      throw new Error(`Attribute ${attribute.name} requires a valid number.`);
    }

    if (attribute.dataType === "BOOLEAN" && !["true", "false"].includes(attribute.value.toLowerCase())) {
      throw new Error(`Attribute ${attribute.name} requires true or false.`);
    }

    if (attribute.dataType === "DATE" && Number.isNaN(Date.parse(attribute.value))) {
      throw new Error(`Attribute ${attribute.name} requires a valid date.`);
    }
  }

  return prisma.$transaction(async (tx) => {
    const updatedItem = await tx.item.update({
      where: {
        id: item.id,
      },
      data: {
        name,
        description: input.description?.trim() || null,
        quantity: new Prisma.Decimal(input.quantity),
      },
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        updatedAt: true,
      },
    });

    const existingAttributes = await tx.itemAttribute.findMany({
      where: {
        itemId: item.id,
        archivedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    await tx.itemAttribute.updateMany({
      where: {
        itemId: item.id,
        archivedAt: null,
      },
      data: {
        archivedAt: new Date(),
      },
    });

    for (const attribute of attributes) {
      await tx.itemAttribute.create({
        data: {
          warehouseId: warehouse.id,
          itemId: item.id,
          name: attribute.name,
          dataType: attribute.dataType,
          value:
            attribute.dataType === "NUMBER"
              ? new Prisma.Decimal(attribute.value)
              : attribute.dataType === "BOOLEAN"
                ? attribute.value.toLowerCase() === "true"
                : attribute.dataType === "DATE"
                  ? new Date(attribute.value).toISOString()
                  : attribute.value,
        },
      });
    }

    const changeEvent = await tx.changeEvent.create({
      data: {
        warehouseId: warehouse.id,
        source: "MANUAL",
        description: `Updated item ${updatedItem.name}`,
      },
      select: {
        id: true,
      },
    });

    await tx.changeEntry.create({
      data: {
        changeEventId: changeEvent.id,
        itemId: item.id,
        changeType: "UPDATE",
        fieldPath: "item",
        beforeValue: {
          name: item.name,
          description: item.description,
          quantity: item.quantity.toString(),
        },
        afterValue: {
          name: updatedItem.name,
          description: updatedItem.description,
          quantity: updatedItem.quantity.toString(),
        },
      },
    });

    for (const attribute of attributes) {
      await tx.changeEntry.create({
        data: {
          changeEventId: changeEvent.id,
          itemId: item.id,
          changeType: "UPDATE",
          fieldPath: `attributes.${attribute.name}`,
          beforeValue: Prisma.JsonNull,
          afterValue: {
            name: attribute.name,
            dataType: attribute.dataType,
            value: attribute.value,
          },
        },
      });
    }

    await tx.warehouseSnapshot.create({
      data: {
        warehouseId: warehouse.id,
        changeEventId: changeEvent.id,
        state: {
          items: (await tx.item.findMany({
            where: {
              warehouseId: warehouse.id,
              archivedAt: null,
            },
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              name: true,
              description: true,
              quantity: true,
              archivedAt: true,
              attributes: {
                where: {
                  archivedAt: null,
                },
                orderBy: {
                  createdAt: "asc",
                },
                select: {
                  id: true,
                  name: true,
                  dataType: true,
                  value: true,
                },
              },
            },
          })).map((entry) => ({
            id: entry.id,
            name: entry.name,
            description: entry.description,
            quantity: Number(entry.quantity),
            archivedAt: entry.archivedAt,
            attributes: entry.attributes.map((attribute) => ({
              id: attribute.id,
              name: attribute.name,
              dataType: attribute.dataType,
              value: attribute.value,
            })),
          })),
        },
      },
    });

    return updatedItem;
  });
};

export const archiveItem = async (itemId: string) => {
  const warehouse = await getDefaultWarehouse();

  if (!warehouse) {
    throw new Error("Default warehouse not found.");
  }

  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      warehouseId: warehouse.id,
    },
  });

  if (!item) {
    throw new Error("Item not found.");
  }

  if (item.archivedAt) {
    return item;
  }

  return prisma.$transaction(async (tx) => {
    const archivedItem = await tx.item.update({
      where: {
        id: item.id,
      },
      data: {
        archivedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        archivedAt: true,
        updatedAt: true,
      },
    });

    const changeEvent = await tx.changeEvent.create({
      data: {
        warehouseId: warehouse.id,
        source: "MANUAL",
        description: `Archived item ${archivedItem.name}`,
      },
      select: {
        id: true,
      },
    });

    await tx.changeEntry.create({
      data: {
        changeEventId: changeEvent.id,
        itemId: item.id,
        changeType: "ARCHIVE",
        fieldPath: "archivedAt",
        beforeValue: item.archivedAt ? item.archivedAt.toISOString() : Prisma.JsonNull,
        afterValue: archivedItem.archivedAt?.toISOString() ?? Prisma.JsonNull,
      },
    });

    await tx.warehouseSnapshot.create({
      data: {
        warehouseId: warehouse.id,
        changeEventId: changeEvent.id,
        state: {
          items: (await tx.item.findMany({
            where: {
              warehouseId: warehouse.id,
              archivedAt: null,
            },
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              name: true,
              description: true,
              quantity: true,
              archivedAt: true,
              attributes: {
                where: {
                  archivedAt: null,
                },
                orderBy: {
                  createdAt: "asc",
                },
                select: {
                  id: true,
                  name: true,
                  dataType: true,
                  value: true,
                },
              },
            },
          })).map((entry) => ({
            id: entry.id,
            name: entry.name,
            description: entry.description,
            quantity: Number(entry.quantity),
            archivedAt: entry.archivedAt,
            attributes: entry.attributes.map((attribute) => ({
              id: attribute.id,
              name: attribute.name,
              dataType: attribute.dataType,
              value: attribute.value,
            })),
          })),
        },
      },
    });

    return archivedItem;
  });
};