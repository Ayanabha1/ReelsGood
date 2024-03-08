"use client";

import { sidebarControls, sidebarOps } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SidebarOpsInterface {
  name: string;
  link: string | undefined;
  icon: LucideIcon;
  action?: (() => void) | undefined;
}

const Sidebar = () => {
  const __sidebarOps: SidebarOpsInterface[] = sidebarOps;
  const __sidebarControls: SidebarOpsInterface[] = sidebarControls;
  const router = useRouter();
  const pathname = usePathname();

  const [path, setPath] = useState<string>("");

  const navOpClickHandler = (option: SidebarOpsInterface) => {
    if (option.link) {
      router.push(option.link);
    } else if (option.action !== undefined) {
      option.action();
    }
  };

  useEffect(() => {
    setPath(pathname);
  }, []);

  return (
    <aside className="flex flex-col p-6 py-6 border-r ">
      {/* Logo */}
      <div className="flex items-center">
        <div className="relative h-10 w-10">
          <Image src="/logo.png" alt="logo" fill />
        </div>
        <h1 className="text-2xl font-semibold">ReelsGood</h1>
      </div>

      <div className="flex flex-col justify-between h-full">
        {/* Options */}
        <div className="flex flex-col mt-3 p-2">
          <span className="text-muted-foreground text-sm">Main Menu</span>
          {__sidebarOps.map((op, i) => (
            <div
              key={i}
              onClick={() => {
                navOpClickHandler(op);
              }}
              className={cn(
                "flex items-center gap-4 py-2 text-muted-foreground cursor-pointer hover:text-black transition-all duration-300",
                op.link === path && "text-black font-bold"
              )}
            >
              <op.icon
                className={cn(
                  "h-5 w-5",
                  op.link === path && "text-black font-bold"
                )}
              />
              <span>{op.name}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col mt-3 p-2">
          <span className="text-muted-foreground text-sm">Controls</span>
          {__sidebarControls.map((op, i) => (
            <div
              key={i}
              onClick={() => {
                navOpClickHandler(op);
              }}
              className={cn(
                "flex items-center gap-4 py-2 text-muted-foreground cursor-pointer hover:text-black transition-all duration-300",
                op.link === path && "text-black font-bold"
              )}
            >
              <op.icon className="h-5 w-5" />
              <span>{op.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
