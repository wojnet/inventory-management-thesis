import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ACTIVE_WAREHOUSE_COOKIE,
  AuthorizationError,
  getSession,
  getWarehouseContext,
} from "@/lib/auth-context";

const Home = async () => {
  const session = await getSession(await headers());

  if (session) {
    const activeWarehouseId = (await cookies()).get(
      ACTIVE_WAREHOUSE_COOKIE,
    )?.value;

    if (!activeWarehouseId) {
      redirect("/warehouses");
    }

    try {
      await getWarehouseContext(session.user.id, activeWarehouseId);
      redirect("/dashboard");
    } catch (error) {
      if (error instanceof AuthorizationError) {
        redirect("/warehouses");
      }

      throw error;
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-[0.2em] text-secondary uppercase">
          Inventory management
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">
          Keep your warehouse in order.
        </h1>
        <p className="mx-auto max-w-xl text-secondary">
          Track items, record changes, and keep your inventory team aligned.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/sign-in"
          className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex h-11 items-center justify-center rounded-full border-2 border-border bg-white px-5 text-sm font-medium transition-colors hover:bg-slate-50"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
};

export default Home;
