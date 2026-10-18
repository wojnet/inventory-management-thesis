import { notFound } from "next/navigation";
import ItemEditForm from "@/app/components/items/ItemEditForm/ItemEditForm";
import { requirePageWarehouseContext } from "@/lib/auth-context";
import { getItemDetails } from "@/lib/items";

type ItemEditPageProps = {
  params: Promise<{ itemId: string }>;
};

const ItemEditPage = async ({ params }: ItemEditPageProps) => {
  const { itemId } = await params;
  const warehouseContext = await requirePageWarehouseContext();
  const item = await getItemDetails(itemId, warehouseContext);

  if (!item) {
    notFound();
  }

  return <ItemEditForm item={item} />;
};

export default ItemEditPage;
