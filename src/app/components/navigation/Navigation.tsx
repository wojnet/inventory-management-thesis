"use client";

import {
  Home as HomeIcon,
  LayoutList as LayoutListIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Workflow as WorkflowIcon,
  X as XIcon,
} from "lucide-react";
import { useState } from "react";
import SignOutButton from "../auth/SignOutButton/SignOutButton";
import ContextMenu from "../common/ContextMenu/ContextMenu";
import NavigationLink from "./NavigationLink";

const navigationLinks = [
  {
    href: "/dashboard",
    text: "Dashboard",
    icon: HomeIcon,
  },
  {
    href: "/items",
    text: "Items",
    icon: LayoutListIcon,
  },
  {
    href: "/actions",
    text: "Actions",
    icon: WorkflowIcon,
  },
  {
    href: "/timeline",
    text: "Timeline",
    icon: TimelineIcon,
  },
];

const settingsLink = {
  href: "/settings",
  text: "Settings",
  icon: SettingsIcon,
};

type NavigationProps = {
  warehouseName: string;
};

const WarehouseHeader = ({ warehouseName }: NavigationProps) => (
  <div className="mb-8 flex items-start justify-between gap-2 rounded-lg border border-border p-3">
    <div className="min-w-0">
      <p className="text-xs text-secondary">Current warehouse</p>
      <p className="truncate text-sm font-medium">{warehouseName}</p>
    </div>
    <ContextMenu label={`Options for ${warehouseName}`}>
      <p className="px-2 py-1.5 text-secondary">No options yet.</p>
    </ContextMenu>
  </div>
);

const NavigationDesktop = ({ warehouseName }: NavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`relative hidden md:flex h-dvh flex-col bg-white border-r-2 border-border shrink-0 px-4 py-8 ${
        isCollapsed ? "w-20" : "w-48"
      }`}
    >
      <h2
        className={`text-4xl font-bold font-heading text-foreground ml-2 mb-8 ${
          isCollapsed ? "hidden" : ""
        }`}
      >
        Thesis
      </h2>

      {isCollapsed ? null : <WarehouseHeader warehouseName={warehouseName} />}

      <nav className="flex flex-col gap-3">
        {navigationLinks.map((link) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            text={link.text}
            icon={link.icon}
            hideText={isCollapsed}
          />
        ))}
      </nav>

      <div className="grow" />

      <NavigationLink
        href={settingsLink.href}
        text={settingsLink.text}
        icon={settingsLink.icon}
        hideText={isCollapsed}
      />

      <SignOutButton hideText={isCollapsed} />

      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="absolute top-1/2 -right-3 z-10 flex h-14 w-6 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-white shadow-sm cursor-pointer"
        aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
      >
        <span className="text-xs">{isCollapsed ? "›" : "‹"}</span>
      </button>
    </div>
  );
};

interface NavigationMobileProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const NavigationMobile = ({
  isOpen,
  setIsOpen,
  warehouseName,
}: NavigationMobileProps & NavigationProps) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex md:hidden w-48 h-dvh flex-col bg-white border-r-2 border-border px-4 py-8 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        type="button"
        className="absolute top-3 right-3 cursor-pointer"
        onClick={() => setIsOpen(false)}
        aria-label="Close navigation"
      >
        <XIcon />
      </button>

      <h2 className="text-4xl font-bold font-heading text-foreground ml-2 mb-8">
        Thesis
      </h2>

      <WarehouseHeader warehouseName={warehouseName} />

      <nav className="flex flex-col gap-3">
        {navigationLinks.map((link) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            text={link.text}
            icon={link.icon}
            onClick={() => setIsOpen(false)}
          />
        ))}
      </nav>

      <div className="grow" />

      <NavigationLink
        href={settingsLink.href}
        text={settingsLink.text}
        icon={settingsLink.icon}
        onClick={() => setIsOpen(false)}
      />

      <SignOutButton onClick={() => setIsOpen(false)} />
    </div>
  );
};

interface BurgerButtonProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const BurgerButton = ({ isOpen, setIsOpen }: BurgerButtonProps) => {
  return (
    <button
      type="button"
      className={`fixed top-3 left-3 z-40 cursor-pointer md:hidden ${
        isOpen ? "hidden" : "block"
      }`}
      onClick={() => setIsOpen(true)}
      aria-label="Open navigation"
    >
      <MenuIcon />
    </button>
  );
};

const Navigation = ({ warehouseName }: NavigationProps) => {
  const [isSmallNavigationOpen, setIsSmallNavigationOpen] = useState(false);

  return (
    <>
      <NavigationDesktop warehouseName={warehouseName} />

      <NavigationMobile
        isOpen={isSmallNavigationOpen}
        setIsOpen={setIsSmallNavigationOpen}
        warehouseName={warehouseName}
      />

      <BurgerButton
        isOpen={isSmallNavigationOpen}
        setIsOpen={setIsSmallNavigationOpen}
      />
    </>
  );
};

export default Navigation;
