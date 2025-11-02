import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DACNA - Next.js",
  description: "A Next.js clean ecommerce app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased text-sm`}>
        <CartProvider>
          {children}
          <Toaster richColors position="top-center" />{" "}
        </CartProvider>
      </body>
    </html>
  );
}
