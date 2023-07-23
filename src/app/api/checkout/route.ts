import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getRandomIntNumber } from "@/lib/utils";
import { NextResponse } from "next/server";
import Stripe from "stripe";

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
            qty: item.qty,
            product: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    addQtyProducts.forEach((product) => {
      line_items.push({
        quantity: product.qty,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: product.priceInt * 100,
        },
      });
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
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
          sales: {
            increment: 1,
          },
        },
      });
    });

    return new NextResponse(JSON.stringify({ url: session.url }), {
      status: 303,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.log(error.message);
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
