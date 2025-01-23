import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  ClerkProvider,
} from "@clerk/nextjs"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Calendly Clone",
  description: "A Simple Calendly-like App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={dmSans.variable}>
        <body
          className={cn("min-h-screen bg-background antialiased")}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
