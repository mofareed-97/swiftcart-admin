import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const products = await db.product.findMany({
      take: 10,
      orderBy: {
        sales: "desc",
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error: any) {
    console.log("err");
    return NextResponse.json(
      { error: error.message, message: "internal error" },
      {
        status: 500,
      }
    );
  }
}
