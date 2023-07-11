import AddProduct from "@/components/form/add-product";
import ProductsTable from "@/components/products/products-table";
import { db } from "@/lib/db";
import { CategoryType, ProductType } from "@/types";

interface IProps {
  products: ProductType[];
  categories: CategoryType[];
}

// export const delay = (ms: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };
async function getAllProducts(time: number = 0): Promise<IProps> {
  // await delay(2500);
  const productsResponse = await fetch("http://localhost:3000/api/product");
  const categories = await db.category.findMany();

  if (!productsResponse.ok || !categories) {
    throw new Error("Failed to fetch movie");
  }

  const productsData = await productsResponse.json();

  return {
    products: productsData.products,
    categories,
  };
}
// async function getAllProducts() {
//   const products = await db.product.deleteMany();
//   return products
// }

export default async function ProductsPage() {
  const { products, categories } = await getAllProducts();

  // const products = await getAllProducts();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <AddProduct categories={categories} />
        </div>
      </div>
      <div className="">
        <ProductsTable products={products} categories={categories} />
      </div>
    </div>
  );
}
