import { notFound } from "next/navigation";
import { getItemDetails } from "@/lib/items";
import ItemEditForm from "@/app/components/items/ItemEditForm/ItemEditForm";

type ItemEditPageProps = {
  params: Promise<{ itemId: string }>;
};

const ItemEditPage = async ({ params }: ItemEditPageProps) => {
  const { itemId } = await params;
  const item = await getItemDetails(itemId);

  if (!item) {
    notFound();
  }

  return <ItemEditForm item={item} />;
};

export default ItemEditPage;