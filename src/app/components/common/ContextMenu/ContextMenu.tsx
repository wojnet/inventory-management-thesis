"use client";

import { Ellipsis } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

type ContextMenuProps = {
  children: ReactNode;
  label: string;
};

const ContextMenu = ({ children, label }: ContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-secondary transition-colors hover:bg-slate-100 hover:text-foreground"
      >
        <Ellipsis className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-44 rounded-lg border border-border bg-white p-2 text-sm shadow-lg"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ContextMenu;
