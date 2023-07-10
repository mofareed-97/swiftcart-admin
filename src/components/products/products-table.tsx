import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ProductType } from "@/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

interface IProps {
  products: ProductType[];
}

function ProductsTable({ products }: IProps) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="">Count In Stock</TableHead>
          <TableHead className="">Price</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div className="bg_product relative h-20">
                  <Image
                    src={product.images[1].url}
                    alt={`${product.name} image`}
                    className="object-cover"
                    sizes="25vw"
                    fill
                  />
                </div>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell className="">{product.countInStock}</TableCell>
              <TableCell className="">
                {format(new Date(product.createdAt), "LLL dd, y")}
              </TableCell>
              <TableCell className="\">$250</TableCell>
              <TableCell className="text-right">
                <Button variant={"ghost"}>
                  <Edit className="w-3 h-3" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default ProductsTable;
