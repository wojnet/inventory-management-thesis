import { ArrowLeft, ScrollText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageWarehouseContext } from "@/lib/auth-context";
import { getTimelineEvent } from "@/lib/timeline";

type TimelineEventPageProps = {
  params: Promise<{ eventId: string }>;
};

const formatDate = (value: string) => new Date(value).toLocaleString();

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
};

const TimelineEventPage = async ({ params }: TimelineEventPageProps) => {
  const { eventId } = await params;
  const { warehouseId } = await requirePageWarehouseContext();
  const event = await getTimelineEvent(eventId, warehouseId);

  if (!event) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-6">
      <Link
        href="/timeline"
        className="inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to timeline
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold">
          {event.description || `${event.source} event`}
        </h1>
        <p className="max-w-2xl text-secondary">
          {formatDate(event.createdAt)}
          {event.actorName ? ` · ${event.actorName}` : ""}
          {event.actionName ? ` · ${event.actionName}` : ""}
        </p>
      </div>

      <section className="rounded-xl border-2 border-border bg-white p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ScrollText className="h-5 w-5" />
          Change entries
        </h2>

        <div className="space-y-3">
          {event.entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-border p-4 space-y-2"
            >
              <p className="text-sm text-secondary">
                {entry.changeType} · {entry.fieldPath}
              </p>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div>
                  <p className="font-medium">Before</p>
                  <pre className="mt-1 whitespace-pre-wrap rounded-md bg-slate-50 p-3">
                    {formatValue(entry.beforeValue)}
                  </pre>
                </div>
                <div>
                  <p className="font-medium">After</p>
                  <pre className="mt-1 whitespace-pre-wrap rounded-md bg-slate-50 p-3">
                    {formatValue(entry.afterValue)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TimelineEventPage;
