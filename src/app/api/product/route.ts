import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validation/product";
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
    return new Response(
      JSON.stringify({ status: "success", product: newProduct }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: error.message, message: "internal error" }),
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        images: true,
        category: true,
      },
    });
    return new Response(JSON.stringify({ products }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message, message: "internal error" }),
      {
        status: 500,
      }
    );
  }
}
