"use client";
import React, { ReactElement, ReactNode } from "react";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface IProps {
  path: string;
  label: string;
  icon: ReactElement;
}
function SideLinkBtn({ label, path, icon }: IProps) {
  const pathName = usePathname();

  const isActive = pathName === path;
  return (
    <Link
      href={path}
      className={cn(
        buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
        "w-full justify-start"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default SideLinkBtn;
