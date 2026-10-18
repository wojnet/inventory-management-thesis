import { ChevronRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { requirePageWarehouseContext } from "@/lib/auth-context";
import { getTimelineEvents } from "@/lib/timeline";

export const dynamic = "force-dynamic";

const formatDate = (value: string) => new Date(value).toLocaleString();

const TimelinePage = async () => {
  const { warehouseId } = await requirePageWarehouseContext();
  const events = await getTimelineEvents(warehouseId);

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Timeline</h1>
        <p className="max-w-2xl text-secondary">
          Browse inventory changes, inspect event details, and restore any
          change from its event entries.
        </p>
      </div>

      <section className="rounded-xl border-2 border-border bg-white p-6">
        {events.length === 0 ? (
          <p className="text-secondary">No inventory changes recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/timeline/${event.id}`}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Clock3 className="h-4 w-4" />
                      {formatDate(event.createdAt)}
                    </div>
                    <p className="font-medium">
                      {event.description || `${event.source} event`}
                    </p>
                    <p className="text-sm text-secondary">
                      {event.entryCount} change
                      {event.entryCount === 1 ? "" : "s"}
                      {event.actorName ? ` · by ${event.actorName}` : ""}
                      {event.actionName ? ` · action ${event.actionName}` : ""}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TimelinePage;
