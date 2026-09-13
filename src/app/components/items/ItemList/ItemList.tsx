"use client";

import ItemRecord from "./ItemRecord";

export interface ItemListEntry {
  id: string;
  name: string;
  quantity: number;
  customAttributes: Array<{
    name: string;
    value: string;
  }>;
  lastChange: string;
}

interface ItemListProps {
  items: ItemListEntry[];
}

const ItemList = ({ items }: ItemListProps) => {
  return (
    <div className="bg-white border-2 border-border p-6 rounded-xl">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[40%]" />
          <col className="w-[10%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[10%]" />
        </colgroup>

        <tbody>
          <tr className="h-8 text-secondary">
            <td className="h-12">Item</td>
            <td className="h-12">Quantity</td>
            <td className="h-12">Custom attributes</td>
            <td className="h-12">Last change</td>
            <td className="h-12"></td>
          </tr>
          {items.length === 0 ? (
            <tr>
              <td className="h-20 text-secondary" colSpan={5}>
                No items have been seeded yet.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <ItemRecord
                key={item.id}
                id={item.id}
                name={item.name}
                quantity={item.quantity}
                customAttributes={item.customAttributes}
                lastChange={item.lastChange}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;