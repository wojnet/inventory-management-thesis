import Navigation from "@/app/components/navigation/Navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings",
};

const SettingsLayout = ({ children }: LayoutProps<"/settings">) => {
  return (
    <div className="w-full h-full flex justify-between">
      <Navigation />
      {children}
    </div>
  );
}

export default SettingsLayout;
