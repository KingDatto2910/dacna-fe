"use client";

import { getAllProducts } from "@/lib/data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import Breadcrumbs from "@/components/breadcrumbs";
/**
 * Trang "Tất cả sản phẩm" (All Products)
 */
export default function AllProductsPage() {
  const allProducts = getAllProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex-1">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        {/* Lưới 5 cột*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
