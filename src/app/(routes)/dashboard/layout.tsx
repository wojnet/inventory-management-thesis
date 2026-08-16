import Navigation from "@/app/components/navigation/Navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const DashboardLayout = ({ children }: LayoutProps<"/dashboard">) => {
  return (
    <div className="w-full h-full flex justify-between">
      <Navigation />
      {children}
    </div>
  );
}

export default DashboardLayout;
