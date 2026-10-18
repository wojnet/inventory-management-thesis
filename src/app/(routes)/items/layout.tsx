import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Items",
  description: "Items",
};

const ItemsLayout = ({ children }: LayoutProps<"/items">) => children;

export default ItemsLayout;
