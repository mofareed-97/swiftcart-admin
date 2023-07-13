import AddProduct from "@/components/form/add-product";
import ProductsTable from "@/components/products/products-table";
import TablePrdouctsPagination from "@/components/products/table-pagination";
import { db } from "@/lib/db";
import { GetProductsValidatorSchema } from "@/lib/validation/product";
import { CategoryType, ProductType } from "@/types";

interface IProps {
  products: {
    results: ProductType[];
    totalPages: number;
  };
  categories: CategoryType[];
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
    // "https://swiftcart-admin.vercel.app/api/product",
    // `http://localhost:3000/api/product?page=${input.page || "1"}`,
    `https://swiftcart-admin.vercel.app/api/product?page=${input.page || "1"}`,
    {
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    }
  );
  const categories = await db.category.findMany();

  if (!productsResponse.ok || !categories) {
    throw new Error("Failed to fetch");
  }

  const productsData = await productsResponse.json();

  return {
    products: productsData,
    categories,
  };
}

interface ProductsParams {
  params: any;
  searchParams: GetProductsValidatorSchema;
}
export default async function ProductsPage({
  params,
  searchParams,
}: ProductsParams) {
  const { products, categories } = await getAllProducts({
    page: searchParams.page,
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
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
