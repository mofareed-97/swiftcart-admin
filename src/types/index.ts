import type { FileWithPath } from "react-dropzone";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export interface StoredFile {
  id: string;
  name: string;
  productId?: string;
  url: string;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  categoryImage?: {
    id: string;
    name: string;
    url: string;
    categoryId: string;
    createdAt: Date;
  }[];
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: string;
  priceInt: number;
  images: StoredFile[];
  mainImage: string | null;
  createdAt: Date;
  rating: number;
  countInStock: number;
  sales: number;
  category: CategoryType;
}

export interface OrderType {
  id: string;
  cn: string;
  isPaid: boolean;
  status: "pending" | "intransit" | "outfordelivery" | "delivered";
  name: string;
  phone: string;
  city: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  orderItem: OrderItemType[];
}

export interface OrderItemType {
  id: string;
  orderId: string;
  productId: string;
  qty: number;
  product: ProductType;
}

export type UserRole = "user" | "admin";

export enum StatusEnum {
  pending,
  intransit,
  outfordelivery,
  delivered,
}
