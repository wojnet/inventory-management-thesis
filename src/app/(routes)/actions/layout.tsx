import Navigation from "@/app/components/navigation/Navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actions",
  description: "Actions",
};

const ActionsLayout = ({ children }: LayoutProps<"/actions">) => {
  return (
    <div className="w-full h-full flex justify-between">
      <Navigation />
      {children}
    </div>
  );
}

export default ActionsLayout;
