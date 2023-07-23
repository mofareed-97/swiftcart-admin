import { OrderType } from "@/types";
import { DataTable } from "@/components/orders-table/data-table";
import { env } from "@/env.mjs";
import { GetOrdersValidatorSchema } from "@/lib/validation/orders";

export const revalidate = 0;

interface OrdersResultFetchType {
  totalPages: number;
  results: OrderType[];
}
async function getData(
  input: GetOrdersValidatorSchema
): Promise<OrdersResultFetchType> {
  // Fetch data from your API here.
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER_URL}/api/orders?page=${input.page || "1"}${
      input.cn ? `&cn=${input.cn}` : ""
    }`
  );

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  const data = await response.json();

  return data;
}

interface OrdersParams {
  params: any;
  searchParams: GetOrdersValidatorSchema;
}
export default async function OrdersPage({
  params,
  searchParams,
}: OrdersParams) {
  const data = await getData({
    page: searchParams.page,
    cn: searchParams.cn,
  });
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="">
        <DataTable data={data.results} />
      </div>
    </div>
  );
}
