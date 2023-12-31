"use client";

import { CategoryValidator } from "@/lib/validation/product";
import { CategoryType, FileWithPreview } from "@/types";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isArrayOfFile, slugHandler } from "@/lib/utils";
import { FileDialog } from "./file-dialog";
import { Button } from "../ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import slugify from "slugify";
import { checkCategory } from "@/app/_actions/products";

type Inputs = z.infer<typeof CategoryValidator>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface IProps {
  isUpdate?: boolean;
}
function AddCategory({ isUpdate = false }: IProps) {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const { isUploading, startUpload } = useUploadThing("productImages");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(CategoryValidator),
    defaultValues: {
      name: "",
    },
  });

  const watchName = form.watch("name");

  function onSubmit(data: Inputs) {
    setIsLoading(true);
    startTransition(async () => {
      try {
        await checkCategory({
          name: data.name,
          slug: data.slug,
        });

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
        // await fetch("http://localhost:3000/api/product", {
        await fetch("api/category", {
          method: "POST",
          body: JSON.stringify({
            ...data,
            images,
          }),
        });

        toast.success("Category added successfully.");
        // Reset form and files
        form.reset();
        setOpenDialog(false);
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
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="cursor-pointer flex items-center justify-between w-full "
        >
          New Category
          <PlusCircle className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form
            className="grid w-full gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="Enter category name here."
                  {...form.register("name")}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.name?.message}
              />
            </FormItem>
            <FormItem>
              <FormLabel>Generate slug</FormLabel>
              <div className="flex items-center w-full gap-2">
                <FormControl>
                  <Input
                    aria-invalid={!!form.formState.errors.name}
                    placeholder="generate category slug."
                    disabled={true}
                    {...form.register("slug")}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={() => {
                    slugHandler(watchName);
                    form.setValue("slug", slugHandler(watchName));
                  }}
                >
                  Generate
                </Button>
              </div>
              <UncontrolledFormMessage
                message={form.formState.errors.name?.message}
              />
            </FormItem>
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel>Category Image</FormLabel>
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="images"
                  maxFiles={1}
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
              Add Category
              <span className="sr-only">Add Category</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCategory;
