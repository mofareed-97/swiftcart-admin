import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/types";
import Image from "next/image";
import React from "react";

function TopSellingProducts({ products }: { products: ProductType[] }) {
  return (
    <div className="space-y-8">
      {products.map((product) => {
        return (
          <div key={product.id} className="flex items-center ">
            <div className="bg_product relative overflow-hidden rounded-full w-20 h-20">
              <Image
                src={product.mainImage || product.images[0].url}
                alt={`${product.name} image`}
                className="object-cover"
                sizes="25vw"
                fill
              />
            </div>
            <div className="ml-4 space-y-1">
              <p className="text-xs font-medium leading-none max-w-xs line-clamp-2 mb-2">
                {product.name}
              </p>

              <Badge variant={"secondary"}>{product.category.name}</Badge>
            </div>
            <div className="ml-auto font-medium">+{product.sales}</div>
          </div>
        );
      })}
    </div>
  );
}

export default TopSellingProducts;
