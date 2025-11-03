// dacna/components/featured-products.tsx

import { getFeaturedProducts } from "@/lib/data";
import ProductCard from "./product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 md:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Trending Now
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {featuredProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2"
                  >
                    <div className="p-1 h-full">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden md:flex left-2" />
              <CarouselNext className="hidden md:flex right-2" />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default FeaturedProducts;
