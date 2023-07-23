"use server";

import { db } from "@/lib/db";
import { CategoryType, OrderType } from "@/types";

export async function checkCategory({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const category = await db.category.findFirst({
    where: {
      OR: [
        {
          name,
        },
        {
          slug,
        },
      ],
    },
  });

  if (category) {
    throw new Error("Category name is repeated");
  }
}

export async function getCategories(): Promise<CategoryType[]> {
  try {
    const categories = await db.category.findMany({
      include: {
        categoryImage: true,
      },
    });

    if (!categories) {
      throw new Error("Something went wrong");
    }

    return categories;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function removeModel() {
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
}
