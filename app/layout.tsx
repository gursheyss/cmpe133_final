import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanceGuard",
  description: "Personal finance management made simple",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full")}>{children}</body>
    </html>
  );
}
