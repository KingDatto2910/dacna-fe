"use client";

import { Product } from "@/lib/types";
import ProductCard from "./product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Định nghĩa props cho component
interface ProductCarouselProps {
  title: string;
  products: Product[];
  keyPrefix: string; // Thêm keyPrefix để tránh lỗi key trùng lặp
}

/**
 * Component Kệ hàng trượt ngang (Carousel) tái sử dụng.
 */
export default function ProductCarousel({
  title,
  products,
  keyPrefix,
}: ProductCarouselProps) {
  // Nếu không có sản phẩm, không hiển thị gì cả
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: products.length > 5, // Chỉ lặp nếu có nhiều sản phẩm
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {products.map((product) => (
            <CarouselItem
              key={`${keyPrefix}-${product.id}`} // Dùng keyPrefix
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2"
            >
              <div className="p-1 h-full">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
