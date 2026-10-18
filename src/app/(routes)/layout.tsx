import Navigation from "@/app/components/navigation/Navigation";
import { requirePageWarehouseContext } from "@/lib/auth-context";

export default async function ApplicationLayout({
  children,
}: LayoutProps<"/">) {
  const { warehouseName } = await requirePageWarehouseContext();

  return (
    <div className="flex min-h-screen">
      <Navigation warehouseName={warehouseName} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
