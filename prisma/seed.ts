import { prisma } from "../src/lib/prisma";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_NAME,
  DEFAULT_WAREHOUSE_DESCRIPTION,
  DEFAULT_WAREHOUSE_NAME,
} from "../src/lib/inventory-context";

async function main() {
  const adminUser =
    (await prisma.appUser.findFirst({
      where: {
        email: DEFAULT_ADMIN_EMAIL,
      },
    })) ??
    (await prisma.appUser.create({
      data: {
        email: DEFAULT_ADMIN_EMAIL,
        name: DEFAULT_ADMIN_NAME,
        passwordHash: "seed-password-hash",
      },
    }));

  const warehouse =
    (await prisma.warehouse.findFirst({
      where: {
        name: DEFAULT_WAREHOUSE_NAME,
      },
    })) ??
    (await prisma.warehouse.create({
      data: {
        name: DEFAULT_WAREHOUSE_NAME,
        description: DEFAULT_WAREHOUSE_DESCRIPTION,
      },
    }));

  await prisma.warehouseMembership.upsert({
    where: {
      userId_warehouseId: {
        userId: adminUser.id,
        warehouseId: warehouse.id,
      },
    },
    create: {
      userId: adminUser.id,
      warehouseId: warehouse.id,
      role: "ADMIN",
    },
    update: {
      role: "ADMIN",
    },
  });

  const seedItems = [
    {
      name: "Packing tape",
      description: "Brown packing tape rolls used for outgoing parcels.",
      quantity: 24,
      attributes: [
        {
          name: "color",
          dataType: "TEXT" as const,
          value: "brown",
        },
      ],
    },
    {
      name: "Shipping boxes",
      description: "Medium cartons for standard shipments.",
      quantity: 120,
      attributes: [
        {
          name: "size",
          dataType: "TEXT" as const,
          value: "M",
        },
        {
          name: "recyclable",
          dataType: "BOOLEAN" as const,
          value: true,
        },
      ],
    },
  ];

  for (const seedItem of seedItems) {
    const existingItem = await prisma.item.findFirst({
      where: {
        warehouseId: warehouse.id,
        name: seedItem.name,
      },
    });

    const item =
      existingItem ??
      (await prisma.item.create({
        data: {
          warehouseId: warehouse.id,
          name: seedItem.name,
          description: seedItem.description,
          quantity: seedItem.quantity,
        },
      }));

    if (!existingItem) {
      for (const attribute of seedItem.attributes) {
        await prisma.itemAttribute.create({
          data: {
            warehouseId: warehouse.id,
            itemId: item.id,
            name: attribute.name,
            dataType: attribute.dataType,
            value: attribute.value,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });