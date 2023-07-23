import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderType } from "@/types";
import { Check, X } from "lucide-react";

export function LatestOrders({ orders }: { orders: OrderType[] }) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">CN #</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.cn}>
            <TableCell className="font-medium">{order.cn}</TableCell>
            <TableCell>
              {order.isPaid ? (
                <Badge
                  variant={"secondary"}
                  className="bg-green-50  text-green-600"
                >
                  <Check className="w-4 h-4 text-green-500 mr-1" />
                  Paid
                </Badge>
              ) : (
                <Badge
                  variant={"secondary"}
                  className="bg-red-50  text-red-600"
                >
                  <X className="w-4 h-4 text-red-500 mr-1" />
                  Not Paid
                </Badge>
              )}
            </TableCell>
            <TableCell>{order.name || "Not Available"}</TableCell>
            <TableCell className="text-right">
              {/* {order.orderItem[0].product.priceInt} */}
              <AmountColumn orderItems={order.orderItem} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AmountColumn({ orderItems }: { orderItems: OrderType["orderItem"] }) {
  let amount = 0;
  orderItems.forEach((item) => {
    amount += item.product.priceInt * item.qty;
  });
  // Format the amount as a dollar amount
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return <div className="text-right font-medium">{formatted}</div>;
}
