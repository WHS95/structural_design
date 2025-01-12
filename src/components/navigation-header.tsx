"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "보 설계",
    href: "/beam",
  },
  {
    title: "슬래브 설계",
    href: "/slab",
  },
  {
    title: "기둥 설계",
    href: "/column",
  },
];

export function NavigationHeader() {
  const pathname = usePathname();

  return (
    <header className='bg-slate-500 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex items-center h-14'>
        <div className='hidden mr-4 md:flex'>
          <Link href='/' className='flex items-center mr-6 space-x-2'>
            <span className='hidden font-bold sm:inline-block'>
              구조설계 도구
            </span>
          </Link>
          <nav className='flex items-center space-x-6 text-sm font-medium'>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
