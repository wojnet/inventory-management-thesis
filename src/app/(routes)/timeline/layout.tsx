import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Timeline",
};

const TimelineLayout = ({ children }: LayoutProps<"/timeline">) => children;

export default TimelineLayout;
