import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { getItemDetails } from "@/lib/items";
import ItemArchiveButton from "@/app/components/items/ItemArchiveButton/ItemArchiveButton";

type ItemPageProps = {
  params: Promise<{ itemId: string }>;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString();
};

const ItemPage = async ({ params }: ItemPageProps) => {
  const { itemId } = await params;
  const item = await getItemDetails(itemId);

  if (!item) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <Link href="/items" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to items
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="max-w-2xl text-secondary">{item.description || "No description provided."}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/items/${item.id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-border bg-white px-5 text-sm font-medium transition-colors hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          <ItemArchiveButton itemId={item.id} isArchived={Boolean(item.archivedAt)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-border bg-white p-5">
          <p className="text-sm text-secondary">Quantity</p>
          <p className="mt-2 text-2xl font-bold">{item.quantity}</p>
        </div>

        <div className="rounded-xl border-2 border-border bg-white p-5">
          <p className="text-sm text-secondary">Status</p>
          <p className="mt-2 text-2xl font-bold">{item.archivedAt ? "Archived" : "Active"}</p>
        </div>

        <div className="rounded-xl border-2 border-border bg-white p-5">
          <p className="text-sm text-secondary">Last change</p>
          <p className="mt-2 text-lg font-medium">{formatDate(item.lastChange)}</p>
        </div>
      </div>

      <section className="rounded-xl border-2 border-border bg-white p-6 space-y-4">
        <h2 className="text-xl font-semibold">Custom attributes</h2>

        {item.customAttributes.length === 0 ? (
          <p className="text-secondary">This item has no custom attributes.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {item.customAttributes.map((attribute) => (
              <li key={attribute.name} className="rounded-lg border border-border p-4">
                <p className="text-sm text-secondary">{attribute.name}</p>
                <p className="mt-1 font-medium">{attribute.value || "—"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ItemPage;