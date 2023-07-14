"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/types";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MultiSelect({ categories }: { categories: CategoryType[] }) {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const categoryParams = searchParams.get("categories") || "";

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const [selectedCategory, setSelectedCategory] = React.useState<String[]>(
    categoryParams ? categoryParams.split(".") : []
  );

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          categories: selectedCategory.length
            ? selectedCategory.join(".")
            : null,
        })}`
      );
    });
  }, [selectedCategory]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Select category...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories.map((item) => {
              return (
                <CommandItem
                  key={item.id}
                  onSelect={(currentValue) => {
                    if (selectedCategory.includes(item.slug)) {
                      const removeCurrentCategory = selectedCategory.filter(
                        (cate) => cate !== item.slug
                      );
                      setSelectedCategory(removeCurrentCategory ?? []);
                      return;
                    }
                    setSelectedCategory((prev) => [...prev, item.slug]);
                  }}
                  className="cursor-pointer"
                >
                  <Checkbox
                    id={item.id}
                    checked={selectedCategory.includes(item.slug)}
                    className="mr-2"
                  />

                  {item.name}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// {categories.map((category) => {
//     return (
//       <SelectItem
//         key={category.id}
//         value={category.slug}
//         className="cursor-pointer"
//       >
//         <div className="flex items-center gap-2">
//   <Checkbox id={category.slug} />
//           {category.name}
//         </div>
//       </SelectItem>
//     );
//   })}
