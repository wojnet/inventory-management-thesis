import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { requireApiWarehouseContext } from "@/lib/auth-context";
import { archiveItem, getItemDetails, updateItem } from "@/lib/items";

type RouteParams = {
  params: Promise<{ itemId: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const warehouseContext = await requireApiWarehouseContext(request);
    const { itemId } = await params;
    const item = await getItemDetails(itemId, warehouseContext);

    if (!item) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const warehouseContext = await requireApiWarehouseContext(request);
    const { itemId } = await params;
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

    const item = await updateItem(
      {
        itemId,
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

    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const warehouseContext = await requireApiWarehouseContext(request);
    const { itemId } = await params;
    const item = await archiveItem(itemId, warehouseContext);

    return NextResponse.json({ item });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
