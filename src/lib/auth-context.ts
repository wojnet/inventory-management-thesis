import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { WarehouseRole } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super("You do not have access to a warehouse.");
    this.name = "AuthorizationError";
  }
}

export type WarehouseContext = {
  userId: string;
  warehouseId: string;
  warehouseName: string;
  role: WarehouseRole;
};

export const ACTIVE_WAREHOUSE_COOKIE = "active-warehouse-id";

export const getSession = async (requestHeaders: Headers) =>
  auth.api.getSession({
    headers: requestHeaders,
  });

const requireSessionFromHeaders = async (requestHeaders: Headers) => {
  const session = await getSession(requestHeaders);

  if (!session) {
    throw new AuthenticationError();
  }

  return session;
};

export const getWarehouseContext = async (
  userId: string,
  warehouseId: string,
): Promise<WarehouseContext> => {
  const membership = await prisma.warehouseMembership.findFirst({
    where: {
      userId,
      warehouseId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      warehouseId: true,
      role: true,
      warehouse: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!membership) {
    throw new AuthorizationError();
  }

  return {
    userId,
    warehouseId: membership.warehouseId,
    warehouseName: membership.warehouse.name,
    role: membership.role,
  };
};

export const requirePageSession = async () => {
  try {
    return await requireSessionFromHeaders(await headers());
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect("/sign-in");
    }

    throw error;
  }
};

export const requirePageWarehouseContext = async () => {
  const session = await requirePageSession();

  const activeWarehouseId = (await cookies()).get(
    ACTIVE_WAREHOUSE_COOKIE,
  )?.value;

  if (!activeWarehouseId) {
    redirect("/warehouses");
  }

  try {
    return await getWarehouseContext(session.user.id, activeWarehouseId);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/warehouses");
    }

    throw error;
  }
};

export const requireApiWarehouseContext = async (request: Request) => {
  const session = await requireSessionFromHeaders(request.headers);
  const activeWarehouseId = request.headers
    .get("cookie")
    ?.match(new RegExp(`(?:^|;\\s*)${ACTIVE_WAREHOUSE_COOKIE}=([^;]+)`))?.[1];

  if (!activeWarehouseId) {
    throw new AuthorizationError();
  }

  return getWarehouseContext(session.user.id, activeWarehouseId);
};

export const getAuthorizationStatus = (error: unknown) => {
  if (error instanceof AuthenticationError) {
    return 401;
  }

  if (error instanceof AuthorizationError) {
    return 403;
  }

  return null;
};
