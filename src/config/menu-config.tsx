import { Box, LayoutGrid, Settings, ShoppingCart, Users } from "lucide-react";

export const menuConfig = [
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
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings className="mr-2 w-4 h-4" />,
  },
];
