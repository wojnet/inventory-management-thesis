import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings",
};

const SettingsLayout = ({ children }: LayoutProps<"/settings">) => children;

export default SettingsLayout;
