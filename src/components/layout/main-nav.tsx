"use client";

import { ModeToggle } from "./theme-toggle";
import type { User } from "@clerk/nextjs/dist/types/server";

import { CommandMenu } from "./command-search";
import UserAvatar from "./UserAvatar";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

function MainNav({ user }: { user: User | null }) {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search /> */}
          <CommandMenu />
          {!user ? (
            <Link
              href={"/signin"}
              className={cn(
                buttonVariants({
                  variant: "secondary",
                })
              )}
            >
              Login
            </Link>
          ) : (
            <UserAvatar user={user} />
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default MainNav;
