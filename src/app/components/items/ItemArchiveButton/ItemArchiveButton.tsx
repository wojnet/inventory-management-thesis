"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ItemArchiveButtonProps = {
  itemId: string;
  isArchived: boolean;
};

const ItemArchiveButton = ({ itemId, isArchived }: ItemArchiveButtonProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArchive = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to archive item.");
      }

      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={isSubmitting || isArchived}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isArchived ? "Archived" : isSubmitting ? "Archiving..." : "Archive"}
    </button>
  );
};

export default ItemArchiveButton;