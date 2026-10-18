import { createWarehouse } from "@/app/warehouses/actions";
import { requirePageSession } from "@/lib/auth-context";

export const dynamic = "force-dynamic";

const CreateWarehousePage = async () => {
  await requirePageSession();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-8 p-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Create warehouse</h1>
        <p className="text-secondary">
          Set up your first warehouse to start managing inventory.
        </p>
      </div>

      <form
        action={createWarehouse}
        className="space-y-4 rounded-xl border-2 border-border bg-white p-6"
      >
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input
            name="name"
            required
            maxLength={100}
            className="h-11 rounded-lg border border-border px-3 outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Description
          <textarea
            name="description"
            maxLength={1000}
            className="min-h-24 rounded-lg border border-border px-3 py-2 outline-none"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
        >
          Create warehouse
        </button>
      </form>
    </main>
  );
};

export default CreateWarehousePage;
