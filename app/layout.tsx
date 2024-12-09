import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./providers";
import "./global.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanceGuard",
  description: "Secure financial management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
