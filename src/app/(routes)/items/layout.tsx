import Navigation from "@/app/components/navigation/Navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Items",
  description: "Items",
};

const ItemsLayout = ({ children }: LayoutProps<"/items">) => {
  return (
    <div className="w-full h-full flex justify-between">
      <Navigation />
      {children}
    </div>
  );
}

export default ItemsLayout;
