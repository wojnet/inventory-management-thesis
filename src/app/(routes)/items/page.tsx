import Link from "next/link";
import ItemList from "@/app/components/items/ItemList/ItemList";
import { getItemList } from "@/lib/items";

export const dynamic = "force-dynamic";

const ITEMS_DESCRIPTION =
  "Seeded demo inventory for the default admin and warehouse context until authentication is implemented.";

const Items = async () => {
  const items = await getItemList();

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="max-w-2xl text-secondary">{ITEMS_DESCRIPTION}</p>
        </div>

        <Link
          href="/items/new"
          className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
        >
          New item
        </Link>
      </div>
      <ItemList items={items} />
    </div>
  );
};

export default Items;