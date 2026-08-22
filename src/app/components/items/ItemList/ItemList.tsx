"use client";

import ItemRecord from "./ItemRecord";

const ItemList = () => {
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
          <ItemRecord
            name="Papier do dupy"
            quantity={23}
            customAttributes="softness: 4"
            lastChange={new Date()}
          />
          <ItemRecord
            name="Patyczki do dupy"
            quantity={67}
            customAttributes=""
            lastChange={new Date()}
          />
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;