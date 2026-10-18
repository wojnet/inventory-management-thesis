import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { requireApiWarehouseContext } from "@/lib/auth-context";
import { getTimelineEvents } from "@/lib/timeline";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { warehouseId } = await requireApiWarehouseContext(request);
    const events = await getTimelineEvents(warehouseId);

    return NextResponse.json({ events });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
