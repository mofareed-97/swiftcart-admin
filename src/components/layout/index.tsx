import React, { ReactNode } from "react";
import { ModeToggle } from "./theme-toggle";
import { Icons } from "./icons";
import Link from "next/link";
import { Search } from "../home/search";
import { UserNav } from "./user-nav";
import { Sidebar } from "./sidebar";

function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <header className="sticky top-0 z-30 border-b  bg-background flex-1">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}

            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
              <ModeToggle />
            </div>
          </div>
        </div>
        {children}
      </header>
    </div>
  );
}

export default PageLayout;
