import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { requireApiWarehouseContext } from "@/lib/auth-context";
import { createItem, getItemList } from "@/lib/items";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const warehouseContext = await requireApiWarehouseContext(request);
    const items = await getItemList(warehouseContext);

    return NextResponse.json({ items });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const warehouseContext = await requireApiWarehouseContext(request);
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      quantity?: number | string;
      attributes?: Array<{
        name?: string;
        dataType?: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";
        value?: string;
      }>;
    };

    const quantity =
      typeof body.quantity === "string" ? Number(body.quantity) : body.quantity;

    if (typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Item name is required." },
        { status: 400 },
      );
    }

    if (quantity === undefined || quantity === null || Number.isNaN(quantity)) {
      return NextResponse.json(
        { error: "Quantity is required." },
        { status: 400 },
      );
    }

    const item = await createItem(
      {
        name: body.name,
        description: body.description,
        quantity,
        attributes: body.attributes
          ?.filter(
            (attribute) =>
              typeof attribute.name === "string" &&
              typeof attribute.dataType === "string",
          )
          .map((attribute) => ({
            name: attribute.name ?? "",
            dataType: attribute.dataType ?? "TEXT",
            value: attribute.value ?? "",
          })),
      },
      warehouseContext,
    );

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
