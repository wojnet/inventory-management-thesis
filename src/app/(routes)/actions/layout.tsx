import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actions",
  description: "Actions",
};

const ActionsLayout = ({ children }: LayoutProps<"/actions">) => children;

export default ActionsLayout;
