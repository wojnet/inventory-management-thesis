"use client";

import NavigationLink from "./NavigationLink";
import { Home, LayoutList, Workflow, Timeline, Settings as Settings } from "lucide-react";

interface NavigationProps {
  
}

const Navigation = ({  }: NavigationProps) => {
  return (
    <div className="w-64 h-screen flex flex-col bg-white border-r-2 border-border shrink-0 px-4 py-8">
      <h2 className="text-5xl text-center font-bold font-heading text-foreground mb-8">
        Thesis
      </h2>
      <nav className="flex flex-col gap-3">
        <NavigationLink
          href="/dashboard"
          text="Dashboard"
          icon={Home}
        />
        <NavigationLink
          href="/items"
          text="Items"
          icon={LayoutList}
        />
        <NavigationLink
          href="/actions"
          text="Actions"
          icon={Workflow}
        />
        <NavigationLink
          href="/timeline"
          text="Timeline"
          icon={Timeline}
        />
      </nav>
      <div className="w-full grow"></div>
      <NavigationLink
        href="/settings"
        text="Settings"
        icon={Settings}
      />
    </div>
  );
};

export default Navigation;