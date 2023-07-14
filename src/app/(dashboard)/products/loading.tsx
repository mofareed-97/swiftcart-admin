import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          {/* <AddProduct categories={categories} /> */}
          <Skeleton className="h-8 w-[160px]" />
          <Skeleton className="h-8 w-[138px]" />
        </div>
      </div>
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="">Count In Stock</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="">Price</TableHead>
              <TableHead className="">Sales</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }, (__, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <Skeleton className="w-20 h-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-44 h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-6 h-4" />
                  </TableCell>
                  <TableCell className="">
                    <Skeleton className="w-6 h-4" />
                  </TableCell>
                  <TableCell className="">
                    <Skeleton className="w-6 h-4" />
                  </TableCell>
                  <TableCell className="">
                    <Skeleton className="w-6 h-4" />
                  </TableCell>
                  <TableCell className="">
                    <Skeleton className="w-6 h-4" />
                  </TableCell>
                  <TableCell className="">
                    <div className="flex h-full items-center justify-end">
                      <Skeleton className="w-6 h-4" />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
