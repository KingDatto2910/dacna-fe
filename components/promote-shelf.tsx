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
import Link from "next/link";
import Image from "next/image";

// Định nghĩa props cho component
interface PromoShelfProps {
  title: string;
  products: Product[];
  keyPrefix: string;
  bannerImage: string; // Đường dẫn đến ảnh banner
  bannerLink: string; // Link khi nhấn vào banner
}

/**
 * Component Kệ hàng "Công thức 2" (Banner + Carousel)
 * (Đã sửa lỗi layout "container-trong-container")
 */
export default function PromoShelf({
  title,
  products,
  keyPrefix,
  bannerImage,
  bannerLink,
}: PromoShelfProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      {/* CỘT 1: BANNER QUẢNG CÁO */}
      <div className="md:col-span-1 h-full">
        <Link href={bannerLink}>
          <div className="relative h-full w-full aspect-square md:aspect-auto overflow-hidden rounded-lg group">
            <Image
              src={bannerImage}
              alt="Promotional Banner"
              fill
              className="object-contain transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </Link>
      </div>

      {/* CỘT 2: CAROUSEL SẢN PHẨM */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
        <Carousel
          opts={{
            align: "start",
            loop: products.length > 4,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {products.map((product) => (
              <CarouselItem
                key={`${keyPrefix}-${product.id}`}
                // Hiển thị 3-4 card
                className="basis-1/2 sm:basis-1/3 lg:basis-1/4 pl-2"
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
      </div>
    </div>
  );
}
