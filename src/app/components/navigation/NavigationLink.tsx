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
}

const NavigationLink = ({ 
  href,
  text,
  icon: Icon,
  className,
}: NavigationLinkProps) => {
  const pathname = usePathname();

  const selectedLink: CSSProperties = {
    background: "var(--background)",
    // border: "1px solid var(--border)"
    boxShadow: "1px 1px 3px #0001"
  } 

  return (
    <Link
      href={href}
    >
      <div
        className={cn("w-full h-10 flex gap-2 items-center hover:text-secondary transition-colors px-2 rounded-xl shrink-0", className)}
        style={ pathname.startsWith(href) ? selectedLink : {} }
      >
        <Icon />
        <p>{text}</p>
      </div>
    </Link>
  );
};

export default NavigationLink;