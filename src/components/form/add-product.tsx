"use client";

import { ProductValidator } from "@/lib/validation/product";
import { CategoryType, FileWithPreview } from "@/types";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isArrayOfFile } from "@/lib/utils";
import { FileDialog } from "./file-dialog";
import { Button } from "../ui/button";
import { Loader2, PackagePlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type Inputs = z.infer<typeof ProductValidator>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface IProps {
  categories: CategoryType[];
}

function AddProduct({ categories }: IProps) {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);

  const { isUploading, startUpload } = useUploadThing("productImages");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(ProductValidator),
    defaultValues: {
      name: "Test Product Name",
      description: "Test Product Description",
      category: categories[0].id,
      price: 10,
      countInStock: 2,
    },
  });

  function onSubmit(data: Inputs) {
    setIsLoading(true);
    startTransition(async () => {
      try {
        // Check if product already exists in the store
        // await checkProductAction({
        //   name: data.name,
        // })

        // Upload images if data.images is an array of files
        if (!isArrayOfFile(data.images)) return;

        const images = await startUpload(data.images).then((res) => {
          const formattedImages = res?.map((image) => ({
            id: image.fileKey,
            name: image.fileKey.split("_")[1] ?? image.fileKey,
            url: image.fileUrl,
          }));
          return formattedImages;
        });

        // Add product to the store

        const newProduct = await fetch("http://localhost:3000/api/product", {
          method: "POST",
          body: JSON.stringify({
            ...data,
            images,
          }),
        });

        toast.success("Product added successfully.");

        // Reset form and files
        form.reset();
        setFiles(null);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Something went wrong.");
      }
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          New Product <PackagePlus className="ml-2 w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form
            className="grid w-full gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="Type product name here."
                  {...form.register("name")}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.name?.message}
              />
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...form.register("description")}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: typeof field.value) =>
                          field.onChange(value)
                        }
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={option.id}
                                className="capitalize"
                              >
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type product price here."
                    {...form.register("price")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.price?.message}
                />
              </FormItem>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>In Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Count In Stock."
                    {...form.register("countInStock", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.countInStock?.message}
                />
              </FormItem>
            </div>
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel>Images</FormLabel>
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="images"
                  maxFiles={4}
                  maxSize={1024 * 1024 * 4}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={isPending}
                />
              </FormControl>
              <UncontrolledFormMessage
              // message={form.formState.errors.images?.message}
              />
            </FormItem>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isLoading}
            >
              {isPending ||
                (isLoading && (
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ))}
              Add Product
              <span className="sr-only">Add Product</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddProduct;

async function addProductAction() {}
