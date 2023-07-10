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
import { CategoryType, ProductType } from "@/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { Badge } from "../ui/badge";
import EditProduct from "../form/edit-product";

interface IProps {
  categories: CategoryType[];
  products: ProductType[];
}

function ProductsTable({ products, categories }: IProps) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="">Count In Stock</TableHead>
          <TableHead>Created At</TableHead>
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
              <TableCell className="max-w-[200px] pr-6">
                <p className="line-clamp-2">{product.name}</p>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{product.category.name}</Badge>
              </TableCell>
              <TableCell className="">{product.countInStock}</TableCell>
              <TableCell className="">
                {format(new Date(product.createdAt), "LLL dd, y")}
              </TableCell>
              <TableCell className="\">${product.price}</TableCell>
              <TableCell className="text-right">
                <EditProduct product={product} categories={categories} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default ProductsTable;
