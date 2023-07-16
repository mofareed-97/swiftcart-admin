import { db } from "@/lib/db";
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
  try {
    const categories = await db.category.findMany();

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
