"use client";

import { Ellipsis, Box } from "lucide-react";

interface ItemRecordProps {
  name: string;
  quantity: number;
  customAttributes?: string;
  lastChange: Date;
}

const ItemRecord = ({
  name,
  quantity,
  customAttributes,
  lastChange,
}: ItemRecordProps) => {
  const dateString = lastChange.toLocaleDateString();
  
  return (
    <tr>
      <td className="h-16 flex items-center gap-2">
        <Box />
        {name}
      </td>
      <td className="h-16">{quantity}</td>
      <td className="h-16">{customAttributes || ""}</td>
      <td className="h-16">{dateString}</td>
      <td className="h-16">
        <button>
          <Ellipsis/>
        </button>
      </td>
    </tr>
  );
};

export default ItemRecord;