import { checkCategory } from "@/app/_actions/products";
import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validation/product";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();

    const { name, slug, images } = CategoryValidator.parse(body);

    if (!name) {
      throw new Error("Name field is required");
    }
    if (!slug) {
      throw new Error("slug field is required");
    }
    if (images.length === 0) {
      throw new Error("Images field is required");
    }

    await checkCategory({ name, slug });

    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        categoryImage: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(
      { status: "success", category: newCategory },
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
  try {
    const categories = await db.category.findMany({
      include: {
        categoryImage: true,
      },
    });

    if (!categories) {
      return NextResponse.json(
        { message: "Categories not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(categories, {
      status: 200,
      headers: corsHeaders,
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
