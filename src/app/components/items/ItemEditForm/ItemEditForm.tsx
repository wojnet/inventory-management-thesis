"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ItemDetailsEntry } from "@/lib/items";

type AttributeRow = {
  id: string;
  name: string;
  dataType: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";
  value: string;
};

type ItemEditFormProps = {
  item: ItemDetailsEntry;
};

const buildAttributeRows = (item: ItemDetailsEntry): AttributeRow[] =>
  item.customAttributes.map((attribute) => ({
    id: crypto.randomUUID(),
    name: attribute.name,
    dataType: "TEXT",
    value: attribute.value,
  }));

const ItemEditForm = ({ item }: ItemEditFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [attributes, setAttributes] = useState<AttributeRow[]>(buildAttributeRows(item));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          quantity: Number(quantity),
          attributes: attributes.map((attribute) => ({
            name: attribute.name,
            dataType: attribute.dataType,
            value: attribute.value,
          })),
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || "Failed to update item.");
      }

      router.push(`/items/${item.id}`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Edit item</h1>
        <p className="max-w-2xl text-secondary">Update the item metadata and custom attributes.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl rounded-xl border-2 border-border bg-white p-6 space-y-5">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input className="h-11 rounded-lg border border-border px-3 outline-none" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Description
          <textarea className="min-h-28 rounded-lg border border-border px-3 py-2 outline-none" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Quantity
          <input type="number" step="0.001" min="0" className="h-11 rounded-lg border border-border px-3 outline-none" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Custom attributes</h2>

            <button
              type="button"
              onClick={() => setAttributes((prev) => [...prev, { id: crypto.randomUUID(), name: "", dataType: "TEXT", value: "" }])}
              className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-white px-4 text-xs font-medium transition-colors hover:bg-slate-50"
            >
              Add attribute
            </button>
          </div>

          <div className="space-y-4">
            {attributes.map((attribute, index) => (
              <div key={attribute.id} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Attribute {index + 1}</p>

                  <button type="button" onClick={() => setAttributes((prev) => prev.filter((entry) => entry.id !== attribute.id))} className="text-xs text-secondary underline underline-offset-2">
                    Remove
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Name
                    <input className="h-11 rounded-lg border border-border px-3 outline-none" value={attribute.name} onChange={(event) => setAttributes((prev) => prev.map((entry) => (entry.id === attribute.id ? { ...entry, name: event.target.value } : entry)))} />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Type
                    <select className="h-11 rounded-lg border border-border px-3 outline-none bg-white" value={attribute.dataType} onChange={(event) => setAttributes((prev) => prev.map((entry) => (entry.id === attribute.id ? { ...entry, dataType: event.target.value as AttributeRow["dataType"] } : entry)))}>
                      <option value="TEXT">Text</option>
                      <option value="NUMBER">Number</option>
                      <option value="BOOLEAN">Boolean</option>
                      <option value="DATE">Date</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Value
                  <input className="h-11 rounded-lg border border-border px-3 outline-none" value={attribute.value} type={attribute.dataType === "NUMBER" ? "number" : attribute.dataType === "DATE" ? "date" : "text"} step={attribute.dataType === "NUMBER" ? "0.001" : undefined} onChange={(event) => setAttributes((prev) => prev.map((entry) => (entry.id === attribute.id ? { ...entry, value: event.target.value } : entry)))} />
                </label>
              </div>
            ))}
          </div>
        </div>

        {errorMessage ? <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p> : null}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>

          <button type="button" onClick={() => router.push(`/items/${item.id}`)} className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-white px-5 text-sm font-medium text-foreground transition-colors hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemEditForm;