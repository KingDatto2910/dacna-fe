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
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

// Định nghĩa props cho component
interface InfoShelfProps {
  // Props cho Cột trái (Info Box)
  infoBoxTitle: string;
  infoBoxDescription: string;
  infoBoxIcon?: ReactNode; // Cho phép truyền icon (ví dụ: các ngôi sao)

  // Props cho Cột phải (Carousel)
  carouselProducts: Product[];
  carouselKeyPrefix: string;
}

export default function InfoShelf({
  infoBoxTitle,
  infoBoxDescription,
  infoBoxIcon,
  carouselProducts,
  carouselKeyPrefix,
}: InfoShelfProps) {
  if (!carouselProducts || carouselProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CỘT 1: INFO BOX */}
        <div className="md:col-span-1 h-full">
          <Card className="h-full flex flex-col justify-center p-6 bg-muted/50">
            <CardContent className="p-0 space-y-3">
              {/* Icon (nếu có) */}
              {infoBoxIcon}

              <h2 className="text-2xl font-bold tracking-tight">
                {infoBoxTitle}
              </h2>
              <p className="text-muted-foreground">{infoBoxDescription}</p>
            </CardContent>
          </Card>
        </div>

        {/* CỘT 2: CAROUSEL SẢN PHẨM */}
        <div className="md:col-span-2">
          <Carousel
            opts={{
              align: "start",
              loop: carouselProducts.length > 4,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {carouselProducts.map((product) => (
                <CarouselItem
                  key={`${carouselKeyPrefix}-${product.id}`}
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
    </section>
  );
}
