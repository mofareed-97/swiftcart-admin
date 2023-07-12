"use client";

import * as React from "react";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "react-hot-toast";

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: "google" },
  { name: "Github", strategy: "oauth_github", icon: "gitHub" },
] satisfies {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
}[];

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return null;
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      setIsLoading(null);

      const unknownError = "Something went wrong, please try again.";

      isClerkAPIResponseError(error)
        ? toast.error(error.errors[0]?.longMessage ?? unknownError)
        : toast.error(unknownError);
    }
  }

  return (
    // <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
    <div className="w-full space-y-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <div key={provider.strategy} className="w-full">
            <Button
              aria-label={`Sign in with ${provider.name}`}
              key={provider.strategy}
              variant="outline"
              className="w-full"
              onClick={() => void oauthSignIn(provider.strategy)}
            >
              {isLoading === provider.strategy ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {provider.name}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
