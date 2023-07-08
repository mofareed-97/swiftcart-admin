import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validation/product";
import slugify from "slugify";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, price, images, category, countInStock, description, slug } =
    ProductValidator.parse(body);

  try {
    const newProduct = await db.product.create({
      data: {
        name,
        description,
        price,
        slug: slugify(name),
        categoryId: category,
        countInStock: 1,
        images: {
          createMany: {
            data: {
              ...images.map((image: any) => image),
            },
          },
        },
      },
    });
    console.log(newProduct);
    return new Response(
      JSON.stringify({ status: "success", product: newProduct }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("err server!");
    console.log(error.message);
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
    const products = await db.product.findMany();
    return new Response(JSON.stringify({ status: "success", products }), {
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
