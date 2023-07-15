import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getRandomIntNumber } from "@/lib/utils";
import { NextResponse } from "next/server";

interface CustomerOrderType {
  id: string;
  qty: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const data: CustomerOrderType[] = await req.json();

  if (!data || data.length === 0) {
    return new NextResponse("There is no products", { status: 400 });
  }

  try {
    const products = await db.product.findMany({
      where: {
        id: {
          in: data.map((order) => order.id),
        },
      },
      include: {
        images: true,
      },
    });

    if (!products || products.length === 0) {
      return new NextResponse("There is no products with provided ids", {
        status: 400,
      });
    }

    const addQtyProducts = products.map((product, i) => ({
      ...product,
      qty: product.id === data[i].id ? data[i].qty : 1,
    }));

    const referenceNumber = await uniqueReferenceOrder();

    const newOrder = await db.order.create({
      data: {
        isPaid: false,
        cn: referenceNumber,
        orderItem: {
          create: data.map((item) => ({
            product: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items: addQtyProducts.map((item) => ({
        mode: "payment",
        quantity: item.qty,
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price.toNumber() * 100,
        },
      })),
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        orderId: newOrder.id,
        cn: newOrder.cn,
      },
      success_url: `${env.NEXT_PUBLIC_APP_URL}?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}?canceled=true`,
    });

    addQtyProducts.forEach(async (product) => {
      await db.product.update({
        where: {
          id: product.id,
        },

        data: {
          countInStock: {
            decrement: product.qty,
          },
        },
      });
    });

    return new NextResponse(session.url, { status: 303 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

const uniqueReferenceOrder = async (): Promise<string> => {
  let unique = false;

  let reference: string = getRandomIntNumber();
  while (!unique) {
    const data = await db.order.findFirst({
      where: {
        cn: reference,
      },
    });

    if (!data || !data.id) {
      unique = true;
      break;
    }
    reference = getRandomIntNumber();
  }
  return reference;
};
