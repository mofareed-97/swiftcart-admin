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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const cn = searchParams.get("cn");
  const limit = 20;

  const count = await db.order.count();
  const totalPages = Math.ceil(count / limit);

  try {
    const orders = await db.order.findMany({
      where: {
        cn: cn
          ? {
              contains: cn,
            }
          : undefined,
      },
      take: limit,
      skip: (parseInt(page) - 1) * limit,
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
      return NextResponse.json(
        { message: "There is no orders" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { totalPages, results: orders },
      {
        status: 200,
        headers: corsHeaders,
      }
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

export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const { name, slug, images } = CategoryValidator.parse(body);

//     if (!name) {
//       throw new Error("Name field is required");
//     }
//     if (!slug) {
//       throw new Error("slug field is required");
//     }
//     if (images.length === 0) {
//       throw new Error("Images field is required");
//     }

//     await checkCategory({ name, slug });

//     const newCategory = await db.category.create({
//       data: {
//         name,
//         slug,
//         categoryImage: {
//           createMany: {
//             data: [...images.map((image: { url: string }) => image)],
//           },
//         },
//       },
//     });

//     return NextResponse.json(
//       { status: "success", category: newCategory },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.log(error);
//     return NextResponse.json(
//       { error: error.message, message: "internal error" },
//       {
//         status: 500,
//       }
//     );
//   }
// }
