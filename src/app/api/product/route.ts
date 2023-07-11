import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validation/product";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, price, images, category, countInStock, description } =
    ProductValidator.parse(body);

  const slug = slugify(
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 200)
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
      .toString()
    //Remove special characters
  );
  try {
    const newProduct = await db.product.create({
      data: {
        name,
        description,
        price,
        slug,
        categoryId: category,
        countInStock,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(
      { status: "success", product: newProduct },
      { status: 200 }
    );
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

export async function GET(req: Request) {
  console.log("fetching...");
  try {
    const products = await db.product.findMany({
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(
      { products },
      {
        status: 200,
      }
    );
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
