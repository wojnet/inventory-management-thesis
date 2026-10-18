import { Box, ClipboardList, Plus, ScrollText } from "lucide-react";
import Link from "next/link";
import { requirePageWarehouseContext } from "@/lib/auth-context";
import { getDashboardSummary } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

const formatDate = (value: string) => new Date(value).toLocaleString();

const Dashboard = async () => {
  const { warehouseId, warehouseName } = await requirePageWarehouseContext();
  const summary = await getDashboardSummary(warehouseId);

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-secondary">{warehouseName}</p>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="max-w-2xl text-secondary">
            A quick overview of your current warehouse.
          </p>
        </div>

        <Link
          href="/items/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          New item
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-border bg-white p-5">
          <div className="flex items-center gap-2 text-secondary">
            <Box className="h-5 w-5" />
            Active items
          </div>
          <p className="mt-3 text-3xl font-bold">{summary.activeItemCount}</p>
        </div>

        <div className="rounded-xl border-2 border-border bg-white p-5">
          <div className="flex items-center gap-2 text-secondary">
            <ClipboardList className="h-5 w-5" />
            Total quantity
          </div>
          <p className="mt-3 text-3xl font-bold">
            {summary.totalQuantity.toLocaleString()}
          </p>
        </div>
      </section>

      <section className="rounded-xl border-2 border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ScrollText className="h-5 w-5" />
            Recent changes
          </h2>
          <Link
            href="/timeline"
            className="text-sm font-medium underline underline-offset-2"
          >
            View timeline
          </Link>
        </div>

        {summary.recentEvents.length === 0 ? (
          <p className="text-secondary">No inventory changes recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {summary.recentEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/timeline/${event.id}`}
                  className="block rounded-lg border border-border p-4 transition-colors hover:bg-slate-50"
                >
                  <p className="font-medium">
                    {event.description || "Inventory change"}
                  </p>
                  <p className="mt-1 text-sm text-secondary">
                    {formatDate(event.createdAt)}
                    {event.actorName ? ` · by ${event.actorName}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
