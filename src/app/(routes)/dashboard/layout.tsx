import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const DashboardLayout = ({ children }: LayoutProps<"/dashboard">) => children;

export default DashboardLayout;
