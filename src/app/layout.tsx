import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationHeader } from "@/components/navigation-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "구조설계 도구",
  description: "KDS 기준에 따른 구조설계 자동화 도구",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ThemeProvider defaultTheme='system' storageKey='theme'>
          <div className='relative flex flex-col min-h-screen'>
            <NavigationHeader />
            <main className='flex-1'>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
