"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACTIVE_WAREHOUSE_COOKIE,
  getWarehouseContext,
  requirePageSession,
} from "@/lib/auth-context";
import { prisma } from "@/lib/prisma";

const selectWarehouse = async (warehouseId: string) => {
  const session = await requirePageSession();
  await getWarehouseContext(session.user.id, warehouseId);

  (await cookies()).set(ACTIVE_WAREHOUSE_COOKIE, warehouseId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
};

export const chooseWarehouse = async (formData: FormData) => {
  const warehouseId = formData.get("warehouseId");

  if (typeof warehouseId !== "string") {
    throw new Error("Warehouse selection is required.");
  }

  await selectWarehouse(warehouseId);
  redirect("/items");
};

export const createWarehouse = async (formData: FormData) => {
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Warehouse name is required.");
  }

  const session = await requirePageSession();
  await prisma.warehouse.create({
    data: {
      name: name.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      memberships: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
        },
      },
    },
  });

  redirect("/warehouses");
};
