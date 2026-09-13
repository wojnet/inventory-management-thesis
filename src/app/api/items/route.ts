import { NextResponse } from "next/server";
import { createItem, getItemList } from "@/lib/items";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getItemList();

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
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

    const item = await createItem({
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

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}