"use client";
import React, { ReactElement, ReactNode } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

interface IProps {
  path: string;
  label: string;
  icon: ReactElement;
}
function LinkBtn({ label, path, icon }: IProps) {
  const router = useRouter();
  const pathName = usePathname();

  const isActive = pathName === path;
  return (
    <Button
      // onClick={() => router.push(path)}
      onClick={() => (window.location.href = path)}
      key={path}
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

export default LinkBtn;
