"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CircleDotDashedIcon } from "lucide-react";
import { statuses } from "./data";
import { updateOrderStatusHandler } from "@/app/_actions/orders";
import { OrderType } from "@/types";
import { toast } from "react-hot-toast";

interface DataTableStatusActionsProps<TData> {
  table: Table<TData>;
}

export function DataTableStatusActions<TData>({
  table,
}: DataTableStatusActionsProps<TData>) {
  const handleUpdate = async (column: {
    value: OrderType["status"];
    label: string;
  }) => {
    const selectedOrders = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedOrders.length === 0) {
      toast.error("There are no orders selected");
      return;
    }

    await updateOrderStatusHandler(selectedOrders, column.value);

    window.location.reload();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <CircleDotDashedIcon className="mr-2 h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statuses.map((column) => {
          return (
            <DropdownMenuItem
              // @ts-ignore
              onClick={() => handleUpdate(column)}
              key={column.value}
              className="cursor-pointer"
            >
              {column.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
