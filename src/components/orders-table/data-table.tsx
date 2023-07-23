"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderType } from "@/types";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableViewOptions } from "./data-table-view-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DebounceInput } from "../debounce-input";
import { DataTableStatusActions } from "./data-table-status-actions";

interface DataTableProps<TData, TValue> {
  data: OrderType[];
}

export function DataTable<TData, TValue>({
  data,
}: DataTableProps<OrderType, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams?.get("cn");

  const columns: ColumnDef<OrderType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),

      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "cn",
      header: "CN #",
      cell: ({ row }) => <div className="capitalize">{row.getValue("cn")}</div>,
    },
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("name") || "Not Avaialble"}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("phone") || "Not Avaialble"}
        </div>
      ),
    },

    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Address
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => (
        <div className="capitalize line-clamp-2 max-w-[170px] ">
          {row.getValue("address") || "Not Avaialble"}
        </div>
      ),
    },
    {
      accessorKey: "city",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            City
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("city") || "Not Available"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusLabel: string =
          row.getValue("status") === "outfordelivery"
            ? "Out For Delivery"
            : row.getValue("status") === "intransit"
            ? "In-Transit"
            : row.getValue("status");
        return (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75",
                  row.getValue("status") === "delivered"
                    ? "bg-green-400 "
                    : row.getValue("status") === "pending"
                    ? "bg-red-400"
                    : "bg-sky-400"
                )}
              ></span>
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  row.getValue("status") === "delivered"
                    ? "bg-green-500 "
                    : row.getValue("status") === "pending"
                    ? "bg-red-500"
                    : "bg-sky-500"
                )}
              ></span>
            </span>

            <div className="capitalize">{statusLabel}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "isPaid",
      header: "Payment",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("isPaid") ? (
            <Badge
              variant={"secondary"}
              className="bg-green-50  text-green-600"
            >
              <Check className="w-4 h-4 text-green-500 mr-1" />
              Paid
            </Badge>
          ) : (
            <Badge variant={"secondary"} className="bg-red-50  text-red-600">
              <X className="w-4 h-4 text-red-500 mr-1" />
              Not Paid
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "orderItem",
      header: () => <div className="text-center">Quantity</div>,
      cell: ({ row }) => {
        let sum = 0;
        const orderItems = row.getValue("orderItem") as OrderType["orderItem"];
        orderItems.forEach((item) => {
          sum += item.qty;
        });

        return (
          <div className="text-center font-medium">
            {sum || "Not Available"}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        // const amount = parseFloat(row.getValue("amount"));
        let amount = 0;
        const orderItems = row.getValue("orderItem") as OrderType["orderItem"];
        orderItems.forEach((item) => {
          amount += item.product.priceInt * item.qty;
        });
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [isPending, startTransition] = React.useTransition();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const [searchFilter, setSearchFilter] = React.useState(searchQuery ?? "");

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          cn: searchFilter ? searchFilter : null,
        })}`
      );
    });
  }, [searchFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <DebounceInput
          placeholder="Filter tasks..."
          value={searchFilter}
          onChange={(value) => setSearchFilter(String(value))}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex flex-1 items-center space-x-2">
          <DataTableToolbar table={table} />
        </div>
        <div className="flex items-center gap-4">
          <DataTableStatusActions table={table} />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border min-h-[700px]">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
