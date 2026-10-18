import Link from "next/link";
import { redirect } from "next/navigation";
import { chooseWarehouse } from "@/app/warehouses/actions";
import { requirePageSession } from "@/lib/auth-context";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const WarehousesPage = async () => {
  const session = await requirePageSession();
  const memberships = await prisma.warehouseMembership.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      role: true,
      warehouse: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  if (memberships.length === 0) {
    redirect("/warehouses/create");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 p-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Your warehouses</h1>
        <p className="text-secondary">
          Choose a warehouse to manage, or create a new one.
        </p>
      </div>

      <section className="space-y-3">
        {memberships.map(({ role, warehouse }) => (
          <form key={warehouse.id} action={chooseWarehouse}>
            <input type="hidden" name="warehouseId" value={warehouse.id} />
            <button
              type="submit"
              className="w-full rounded-xl border-2 border-border bg-white p-5 text-left transition-colors hover:bg-slate-50"
            >
              <p className="font-semibold">{warehouse.name}</p>
              <p className="mt-1 text-sm text-secondary">
                {warehouse.description || "No description"} ·{" "}
                {role.toLowerCase()}
              </p>
            </button>
          </form>
        ))}
      </section>

      <Link
        href="/warehouses/create"
        className="inline-flex h-11 w-fit items-center justify-center rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
      >
        Create warehouse
      </Link>
    </main>
  );
};

export default WarehousesPage;
