"use client";

import { CSSProperties, ForwardRefExoticComponent, RefAttributes } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";


interface NavigationLinkProps {
  href: string;
  text: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  className?: string;
  onClick?: () => any;
  hideText?: boolean;
}

const NavigationLink = ({ 
  href,
  text,
  icon: Icon,
  className,
  onClick,
  hideText,
}: NavigationLinkProps) => {
  const pathname = usePathname();

  const selectedLink: CSSProperties = {
    background: "var(--background)",
    // border: "1px solid var(--border)"
    boxShadow: "1px 1px 3px #0001"
  } 

  if (hideText === true) return (
    <Link
      href={href}
      onClick={onClick}
    >
      <div
        className={cn("w-full h-10 flex justify-center items-center hover:text-secondary transition-colors px-2 rounded-xl shrink-0", className)}
        style={ pathname.startsWith(href) ? selectedLink : {} }
      >
        <Icon min={24} />
      </div>
    </Link>
  );

  return (
    <Link
      href={href}
      onClick={onClick}
    >
      <div
        className={cn("w-full h-10 flex gap-2 items-center hover:text-secondary transition-colors px-2 rounded-xl shrink-0", className)}
        style={ pathname.startsWith(href) ? selectedLink : {} }
      >
        <Icon min={24} />
        <p className="text-sm md:text-base">
          {text}
        </p>
      </div>
    </Link>
  );
};

export default NavigationLink;