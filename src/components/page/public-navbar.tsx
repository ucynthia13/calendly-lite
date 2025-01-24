"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SignInButton } from "@clerk/nextjs";
import { CalendarRange, X, MenuIcon } from "lucide-react";

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { label: "Home", link: "/", ctaButton: false },
    { label: "Features", link: "/features", ctaButton: false },
    { label: "Pricing", link: "/pricing", ctaButton: false },
    { label: "Contact Us", link: "/contact", ctaButton: true },
  ];

  return (
    <nav className="md:py-6 px-4 py-4 md:px-6" aria-label="Main">
      <div className="flex flex-col justify-between py-2 font-medium md:flex-row md:items-center">
        {/* Brand Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="z-50" onClick={() => setOpen(false)}>
            <h2 className="flex gap-2 font-bold text-primary">
              <CalendarRange className="size-8"/>
              <span className="text-3xl">CalClone</span>
            </h2>
            <span className="sr-only">CalendlyLike Home Page</span>
          </Link>
          <button
            type="button"
            className="block p-2 text-3xl md:hidden"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
            <span className="sr-only">Open menu</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={clsx(
            "fixed bottom-0 left-0 right-0 top-0 z-40 flex flex-col items-end pr-4 pt-14 transition-transform duration-300 ease-in-out motion-reduce:transition-none md:hidden",
            open ? "translate-x-0" : "translate-x-[100%]"
          )}
        >
          <button
            type="button"
            className="fixed right-4 top-4 mb-4 block p-2 text-3xl md:hidden"
            aria-expanded={open}
            onClick={() => setOpen(false)}
          >
            <X />
            <span className="sr-only">Close menu</span>
          </button>

          <div className="grid justify-items-end gap-8">
            {navigation.map((item, index) => {
              if (item.ctaButton) {
                return (
                  <Button className="bg-primary" key={index} asChild>
                    <SignInButton />
                  </Button>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.link}
                  onClick={() => setOpen(false)}
                  className="block px-3 text-3xl first:mt-8 hover:underline"
                  aria-current={pathname === item.link ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden gap-6 md:flex">
          {navigation.map((item, index) => {
            if (item.ctaButton) {
              return (
                <li key={item.label} key={index}>
                 <Button className="bg-primary" asChild>
                  <SignInButton />
                 </Button>
                </li>
              );
            }
            return (
              <li key={item.label}>
                <Link
                  href={item.link}
                  className="inline-flex min-h-11 items-center hover:underline"
                  aria-current={pathname === item.link ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
