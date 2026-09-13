import { NextResponse } from "next/server";
import { archiveItem, getItemDetails, updateItem } from "@/lib/items";

type RouteParams = {
  params: Promise<{ itemId: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RouteParams) {
  const { itemId } = await params;
  const item = await getItemDetails(itemId);

  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
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

    const quantity = typeof body.quantity === "string" ? Number(body.quantity) : body.quantity;

    if (typeof body.name !== "string") {
      return NextResponse.json({ error: "Item name is required." }, { status: 400 });
    }

    if (quantity === undefined || quantity === null || Number.isNaN(quantity)) {
      return NextResponse.json({ error: "Quantity is required." }, { status: 400 });
    }

    const item = await updateItem({
      itemId,
      name: body.name,
      description: body.description,
      quantity,
      attributes: body.attributes
        ?.filter((attribute) => typeof attribute.name === "string" && typeof attribute.dataType === "string")
        .map((attribute) => ({
          name: attribute.name ?? "",
          dataType: attribute.dataType ?? "TEXT",
          value: attribute.value ?? "",
        })),
    });

    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { itemId } = await params;
    const item = await archiveItem(itemId);

    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}