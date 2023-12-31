import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { currentUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";
import MainNav from "@/components/layout/main-nav";

const inter = Inter({ subsets: ["latin"] });


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex">
            <Sidebar />

            <div className=" z-30 border-b  bg-background flex-1">
              <MainNav user={user} />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
