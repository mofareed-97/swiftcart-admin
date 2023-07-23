import { db } from "@/lib/db";
import { slugHandler } from "@/lib/utils";
import { CategoryValidator } from "@/lib/validation/product";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { utapi } from "uploadthing/server";

interface CategoryParamsType {
  params: {
    categoryId: string;
  };
}

export async function GET(req: Request, { params }: CategoryParamsType) {
  try {
    const category = await db.category.findFirst({
      where: {
        slug: params.categoryId,
      },
      include: {
        categoryImage: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(category, {
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

export async function DELETE(req: Request, { params }: CategoryParamsType) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const category = await db.category.findFirst({
      where: {
        slug: params.categoryId,
      },
      include: {
        categoryImage: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        {
          status: 404,
        }
      );
    }

    await utapi.deleteFiles(category.categoryImage.map((img) => img.id));

    await db.category.delete({
      where: {
        id: category.id,
      },
    });

    return NextResponse.json(
      { status: "success" },
      {
        status: 200,
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

export async function PATCH(req: Request, { params }: CategoryParamsType) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name, images } = CategoryValidator.parse(body);

  try {
    const category = await db.category.findFirst({
      where: {
        id: params.categoryId,
      },
      include: {
        categoryImage: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        {
          status: 404,
        }
      );
    }

    const withoutImageUpdate = category.categoryImage.find(
      (img) => img.id === images[0].id
    );

    if (withoutImageUpdate || images.length === 0) {
      await db.category.update({
        where: {
          id: params.categoryId,
        },
        data: {
          name,
          slug: slugHandler(name),
        },
      });

      return NextResponse.json(
        {
          status: "success",
          message: "Category updated Successfully",
        },
        { status: 200 }
      );
    }
    await utapi.deleteFiles(category.categoryImage.map((img) => img.id));

    const updatedCategory = await db.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        slug: slugHandler(name),
        categoryImage: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Category updated Successfully",
      },
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
