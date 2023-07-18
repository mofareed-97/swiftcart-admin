import { removeModel } from "@/app/_actions/products";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "m5gr84i9",
      amount: 316,
      name: "Mohamed",
      status: "success",
      email: "ken99@yahoo.com",
      isPaid: true,
      qty: 3,
    },
    {
      id: "3u1reuv4",
      name: "Ahmed",
      amount: 242,
      status: "success",
      email: "Abe45@gmail.com",
      isPaid: true,
      qty: 6,
    },
    {
      id: "derv1ws0",
      name: "Khalied",
      amount: 837,
      status: "processing",
      email: "Monserrat44@gmail.com",
      isPaid: false,
      qty: 1,
    },
    {
      id: "5kma53ae",
      name: "Mohamed",
      amount: 874,
      status: "success",
      email: "Silas22@gmail.com",
      isPaid: true,
      qty: 1,
    },
    {
      id: "bhqecj4p",
      name: "Ryan",
      amount: 721,
      status: "failed",
      email: "carmella@hotmail.com",
      isPaid: false,
      qty: 2,
    },
  ];
}
export default async function OrdersPage() {
  const data = await getData();
  // const rmmodel = await removeModel();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
