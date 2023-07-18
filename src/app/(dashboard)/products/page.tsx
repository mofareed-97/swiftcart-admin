import { getCategories } from "@/app/_actions/products";
import AddProduct from "@/components/form/add-product";
import { MultiSelect } from "@/components/multi-select";
import ProductsTable from "@/components/products/products-table";
import TablePrdouctsPagination from "@/components/products/table-pagination";
import { db } from "@/lib/db";
import { GetProductsValidatorSchema } from "@/lib/validation/product";
import { CategoryType, ProductType } from "@/types";

interface IProps {
  results: ProductType[];
  totalPages: number;
}

interface CategoryPageProps {
  params: any;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

async function getAllProducts(
  input: GetProductsValidatorSchema
): Promise<IProps> {
  const productsResponse = await fetch(
    `https://swiftcart-admin.vercel.app/api/product?page=${input.page || "1"}${
      input.categories ? `&categories=${input.categories}` : ""
    }`,
    // `http://localhost:3000/api/product?page=${input.page || "1"}${
    //   input.categories ? `&categories=${input.categories}` : ""
    // }`,
    {
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    }
  );

  if (!productsResponse.ok) {
    throw new Error("Failed to fetch");
  }

  const productsData = await productsResponse.json();

  return productsData;
}

interface ProductsParams {
  params: any;
  searchParams: GetProductsValidatorSchema;
}
export default async function ProductsPage({
  params,
  searchParams,
}: ProductsParams) {
  const products = await getAllProducts({
    page: searchParams.page,
    categories: searchParams.categories,
  });
  const categories = await getCategories();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <MultiSelect categories={categories} />
          <AddProduct categories={categories} />
        </div>
      </div>
      <div className="">
        <ProductsTable products={products.results} categories={categories} />
        <TablePrdouctsPagination totalPages={products.totalPages} />
      </div>
    </div>
  );
}
