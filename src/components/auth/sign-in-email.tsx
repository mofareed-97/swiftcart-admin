"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { AuthValidator } from "@/lib/validation/auth";
import { Loader2 } from "lucide-react";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Icons } from "../icons";

type Inputs = z.infer<typeof AuthValidator>;

export function SignInWithEmail() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(AuthValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const result = await signIn.create({
          identifier: data.email,
          password: data.password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });

          router.push(`${window.location.origin}/`);
        } else {
          /*Investigate why the login hasn't completed */
          console.log(result);
        }
      } catch (error) {
        const unknownError = "Something went wrong, please try again.";

        isClerkAPIResponseError(error)
          ? toast.error(error.errors[0]?.longMessage ?? unknownError)
          : toast.error(unknownError);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(...args) => form.handleSubmit(onSubmit)(...args)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="***********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign in with email
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  );
}
