"use client";

import Link from "next/link";
import { Ellipsis, Box } from "lucide-react";

interface ItemRecordProps {
  id: string;
  name: string;
  quantity: number;
  customAttributes: Array<{
    name: string;
    value: string;
  }>;
  lastChange: string;
}

const ItemRecord = ({
  id,
  name,
  quantity,
  customAttributes,
  lastChange,
}: ItemRecordProps) => {
  const dateString = new Date(lastChange).toLocaleDateString();
  const attributesLabel =
    customAttributes.length === 0
      ? "—"
      : customAttributes.map(({ name: attributeName, value }) => `${attributeName}: ${value}`).join(", ");
  
  return (
    <tr>
      <td className="h-16 flex items-center gap-2">
        <Box />
        <Link href={`/items/${id}`} className="hover:underline">
          {name}
        </Link>
      </td>
      <td className="h-16">{quantity}</td>
      <td className="h-16">{attributesLabel}</td>
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