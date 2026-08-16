import Navigation from "@/app/components/navigation/Navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Timeline",
};

const TimelineLayout = ({ children }: LayoutProps<"/timeline">) => {
  return (
    <div className="w-full h-full flex justify-between">
      <Navigation />
      {children}
    </div>
  );
}

export default TimelineLayout;
