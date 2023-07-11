import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validation/product";
import { StoredFile } from "@/types";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { utapi } from "uploadthing/server";

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const body = await req.json();

  //   const { name, price, images, category, countInStock, description } =
  const {
    name,
    price,
    images,
    category,
    countInStock,
    description,
    mainImage,
  } = ProductValidator.parse(body);
  try {
    const product = await db.product.findFirst({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        {
          status: 404,
        }
      );
    }

    const slug = slugify(
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .slice(0, 200)
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
        .toString()
      //Remove special characters
    );

    const withoutImageUpdate = product.images.find(
      (img) => img.id === images[0].id
    );

    if (withoutImageUpdate) {
      await db.product.update({
        where: {
          id: params.productId,
        },
        data: {
          name,
          description,
          price,
          slug,
          categoryId: category,
          countInStock,
          mainImage,
        },
      });

      return NextResponse.json(
        {
          status: "success",
          message: "Product updated Successfully",
        },
        { status: 200 }
      );
    }
    await utapi.deleteFiles(product.images.map((img) => img.id));

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        description,
        price,
        slug,
        categoryId: category,
        countInStock,
        mainImage: mainImage ? mainImage : images[0].url,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    // revalidatePath("/products");

    return NextResponse.json(
      {
        status: "success",
        message: "Product updated Successfully",
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
