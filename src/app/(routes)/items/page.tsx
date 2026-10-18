import Link from "next/link";
import ItemList from "@/app/components/items/ItemList/ItemList";
import { requirePageWarehouseContext } from "@/lib/auth-context";
import { getItemList } from "@/lib/items";

export const dynamic = "force-dynamic";

const ITEMS_DESCRIPTION = "Manage inventory for your active warehouse.";

const Items = async () => {
  const warehouseContext = await requirePageWarehouseContext();
  const items = await getItemList(warehouseContext);

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="max-w-2xl text-secondary">{ITEMS_DESCRIPTION}</p>
        </div>

        <Link
          data-testid="items-page/new-item-button"
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
