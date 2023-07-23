import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { ArrowDownUp, BadgeCheck, Clock12, Truck } from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock12,
  },
  {
    value: "intransit",
    label: "In-Transit",
    icon: ArrowDownUp,
  },
  {
    value: "outfordelivery",
    label: "Our For Delivery",
    icon: Truck,
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: BadgeCheck,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
