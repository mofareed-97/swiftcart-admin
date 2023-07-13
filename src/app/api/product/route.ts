import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validation/product";
import { revalidatePath } from "next/cache";
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
        name: name.trim(),
        description: description.trim(),
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
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || "1";
  const limit = 20;
  const count = await db.product.count();
  const totalPages = Math.ceil(count / limit);

  try {
    const products = await db.product.findMany({
      take: limit,
      skip: (parseInt(page) - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(
      { totalPages, results: products },
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
