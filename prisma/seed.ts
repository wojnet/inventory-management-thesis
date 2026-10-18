import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";
import {
  DEFAULT_WAREHOUSE_DESCRIPTION,
  DEFAULT_WAREHOUSE_NAME,
} from "../src/lib/inventory-context";

const TEST_USER_PASSWORD = "Password123!";

const TEST_USERS = [
  { email: "test@example.com", name: "Test" },
  { email: "test2@example.com", name: "Test 2" },
];

async function main() {
  await prisma.$transaction([
    prisma.warehouseSnapshot.deleteMany(),
    prisma.changeEntry.deleteMany(),
    prisma.changeEvent.deleteMany(),
    prisma.actionStep.deleteMany(),
    prisma.action.deleteMany(),
    prisma.itemAttribute.deleteMany(),
    prisma.item.deleteMany(),
    prisma.warehouseMembership.deleteMany(),
    prisma.warehouse.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.verification.deleteMany(),
    prisma.appUser.deleteMany(),
  ]);

  const warehouse = await prisma.warehouse.create({
    data: {
      name: DEFAULT_WAREHOUSE_NAME,
      description: DEFAULT_WAREHOUSE_DESCRIPTION,
    },
  });

  for (const testUser of TEST_USERS) {
    const { user } = await auth.api.signUpEmail({
      body: {
        email: testUser.email,
        password: TEST_USER_PASSWORD,
        name: testUser.name,
      },
    });

    await prisma.warehouseMembership.create({
      data: {
        userId: user.id,
        warehouseId: warehouse.id,
        role: "WORKER",
      },
    });
  }

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
    const item = await prisma.item.create({
      data: {
        warehouseId: warehouse.id,
        name: seedItem.name,
        description: seedItem.description,
        quantity: seedItem.quantity,
      },
    });

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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });