import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SignInWithEmail } from "@/components/auth/sign-in-email";
import { OAuthSignIn } from "@/components/auth/oauth-signin";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="lg:p-8 relative h-full w-full">
      <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-2">
        <Link
          href="/signup"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Sign up
        </Link>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center h-full  space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Choose your preferred sign in method
          </p>
        </div>
        <SignInWithEmail />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <OAuthSignIn />
      </div>
    </div>
  );
}
