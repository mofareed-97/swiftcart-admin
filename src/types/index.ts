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
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  images: StoredFile[];
  mainImage: string | null;
  createdAt: Date;
  rating: number;
  countInStock: number;
  category: CategoryType;
}
