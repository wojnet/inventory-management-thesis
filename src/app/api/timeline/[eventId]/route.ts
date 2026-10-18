import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/api-errors";
import { requireApiWarehouseContext } from "@/lib/auth-context";
import { getTimelineEvent } from "@/lib/timeline";

type RouteParams = {
  params: Promise<{ eventId: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { warehouseId } = await requireApiWarehouseContext(request);
    const { eventId } = await params;
    const event = await getTimelineEvent(eventId, warehouseId);

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
