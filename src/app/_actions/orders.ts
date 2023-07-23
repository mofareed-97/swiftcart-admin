"use server";

import { db } from "@/lib/db";
import { OrderType, StatusEnum } from "@/types";

export async function updateOrderStatusHandler(
  list: any[],
  newStatus: OrderType["status"]
): Promise<boolean> {
  list.forEach(async (item: OrderType) => {
    const updatedOrder = await db.order.update({
      where: {
        id: item.id,
      },
      data: {
        status: newStatus,
      },
    });

    if (!updatedOrder) {
      throw new Error("Order not found");
    }
  });

  return true;
}

export async function ordersAnalytic(): Promise<{
  totalRevenue: number;
  completedOrders: number;
  totalOrders: number;
  latestOrders: any[];
  topSellingProducts: any[];
}> {
  let sum = 0;
  let completedOrders = 0;
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!orders) {
    return {
      latestOrders: [],
      topSellingProducts: [],
      totalRevenue: sum,
      completedOrders,
      totalOrders: 0,
    };
  }

  const topSellingProducts = await db.product.findMany({
    orderBy: {
      sales: "desc",
    },
    take: 5,
    include: {
      images: true,
      category: true,
    },
  });
  orders.forEach((order) => {
    if (order.isPaid) {
      order.orderItem.forEach((item) => {
        sum += item.product.priceInt * item.qty;
      });
    }

    if (order.status === "delivered") {
      completedOrders += 1;
    }
  });

  const latestOrders = orders.slice(0, 5);

  return {
    totalRevenue: sum,
    completedOrders,
    totalOrders: orders.length,
    latestOrders,
    topSellingProducts,
  };
}
