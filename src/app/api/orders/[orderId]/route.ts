import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validation/product";
import { StoredFile } from "@/types";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { utapi } from "uploadthing/server";

interface OrderParamsType {
  params: {
    orderId: string;
  };
}

export async function GET(req: Request, { params }: OrderParamsType) {
  try {
    const order = await db.order.findFirst({
      where: {
        id: params.orderId,
      },
      include: {
        orderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(order, {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message, message: "internal error" },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: Request, { params }: OrderParamsType) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
}

// export async function PATCH(req: Request, { params }: OrderParamsType) {}
