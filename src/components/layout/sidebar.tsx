import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Box,
  LayoutGrid,
  LogOut,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Icons } from "./icons";
import LinkBtn from "./routeBtn";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export type Playlist = (typeof playlists)[number];

export const playlists = [
  "Recently Added",
  "Recently Played",
  "Top Songs",
  "Top Albums",
  "Top Artists",
  "Logic Discography",
  "Bedtime Beats",
  "Feeling Happy",
  "I miss Y2K Pop",
  "Runtober",
  "Mellow Days",
  "Eminem Essentials",
];

const sideLinks = [
  {
    label: "Overview",
    path: "/",
    icon: <LayoutGrid className="mr-2 w-4 h-4" />,
  },
  {
    label: "Products",
    path: "/products",
    icon: <Box className="mr-2 w-4 h-4" />,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: <ShoppingCart className="mr-2 w-4 h-4" />,
  },

  {
    label: "Users",
    path: "/users",
    icon: <Users className="mr-2 w-4 h-4" />,
  },
];
export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 h-screen w-56 border-r", className)}>
      <div className="py-4 px-3 flex justify-center items-center gap-2 border-b">
        <Link href={"/"} className="">
          <Icons.logo className=" h-7 w-7 fill-zinc-700 dark:fill-white" />
        </Link>
        <p className="text-lg font-bold pt-1">SwiftCart</p>
      </div>
      <div className="space-y-4 py-4 h-full flex flex-col justify-between  ">
        <div className="px-3 py-2 ">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {sideLinks.map((item) => {
              return (
                <LinkBtn
                  key={item.path}
                  path={item.path}
                  label={item.label}
                  icon={item.icon}
                />
              );
            })}
          </div>
        </div>

        <div className="px-3 py-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 w-4 h-4" />
            <span>Settings</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
