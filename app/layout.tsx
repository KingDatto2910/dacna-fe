import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";

export const metadata: Metadata = {
  title: "DACNA - Ecommerce",
  description: "A Next.js ecommerce app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
