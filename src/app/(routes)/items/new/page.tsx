"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type AttributeRow = {
  id: string;
  name: string;
  dataType: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";
  value: string;
};

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  quantity: "0",
};

const createAttributeRow = (): AttributeRow => ({
  id: crypto.randomUUID(),
  name: "",
  dataType: "TEXT",
  value: "",
});

const NewItemPage = () => {
  const router = useRouter();
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          quantity: Number(formState.quantity),
          attributes: attributes.map((attribute) => ({
            name: attribute.name,
            dataType: attribute.dataType,
            value: attribute.value,
          })),
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || "Failed to create item.");
      }

      router.push("/items");
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
        <h1 className="text-3xl font-bold">Create item</h1>
        <p className="max-w-2xl text-secondary">
          Add a new inventory item to the default seeded warehouse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl rounded-xl border-2 border-border bg-white p-6 space-y-5">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input
            className="h-11 rounded-lg border border-border px-3 outline-none"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Description
          <textarea
            className="min-h-28 rounded-lg border border-border px-3 py-2 outline-none"
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Quantity
          <input
            type="number"
            step="0.001"
            min="0"
            className="h-11 rounded-lg border border-border px-3 outline-none"
            value={formState.quantity}
            onChange={(event) => setFormState((prev) => ({ ...prev, quantity: event.target.value }))}
            required
          />
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Custom attributes</h2>

            <button
              type="button"
              onClick={() => setAttributes((prev) => [...prev, createAttributeRow()])}
              className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-white px-4 text-xs font-medium transition-colors hover:bg-slate-50"
            >
              Add attribute
            </button>
          </div>

          {attributes.length === 0 ? (
            <p className="text-sm text-secondary">No custom attributes yet.</p>
          ) : null}

          <div className="space-y-4">
            {attributes.map((attribute, index) => (
              <div key={attribute.id} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Attribute {index + 1}</p>

                  <button
                    type="button"
                    onClick={() => setAttributes((prev) => prev.filter((entry) => entry.id !== attribute.id))}
                    className="text-xs text-secondary underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Name
                    <input
                      className="h-11 rounded-lg border border-border px-3 outline-none"
                      value={attribute.name}
                      onChange={(event) =>
                        setAttributes((prev) =>
                          prev.map((entry) =>
                            entry.id === attribute.id
                              ? { ...entry, name: event.target.value }
                              : entry,
                          ),
                        )
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Type
                    <select
                      className="h-11 rounded-lg border border-border px-3 outline-none bg-white"
                      value={attribute.dataType}
                      onChange={(event) =>
                        setAttributes((prev) =>
                          prev.map((entry) =>
                            entry.id === attribute.id
                              ? {
                                  ...entry,
                                  dataType: event.target.value as AttributeRow["dataType"],
                                }
                              : entry,
                          ),
                        )
                      }
                    >
                      <option value="TEXT">Text</option>
                      <option value="NUMBER">Number</option>
                      <option value="BOOLEAN">Boolean</option>
                      <option value="DATE">Date</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Value
                  <input
                    className="h-11 rounded-lg border border-border px-3 outline-none"
                    value={attribute.value}
                    type={attribute.dataType === "NUMBER" ? "number" : attribute.dataType === "DATE" ? "date" : "text"}
                    step={attribute.dataType === "NUMBER" ? "0.001" : undefined}
                    onChange={(event) =>
                      setAttributes((prev) =>
                        prev.map((entry) =>
                          entry.id === attribute.id
                            ? { ...entry, value: event.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create item"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/items")}
            className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-white px-5 text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewItemPage;