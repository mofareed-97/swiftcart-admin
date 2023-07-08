import AddProduct from "@/components/form/add-product";

async function getAllProducts() {
  const response = await fetch("http://localhost:3000/api/product");

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
}

export default async function ProductsPage() {
  const products = await getAllProducts();

  console.log(products);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <AddProduct />
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}
