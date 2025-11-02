import { getFeaturedProducts } from "@/lib/data";
import ProductCard from "./product-card";
// Import các component Carousel bạn vừa cài đặt
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/**
 * FeaturedProducts component (Carousel Design)
 */
function FeaturedProducts() {
  // Lấy dữ liệu sản phẩm nổi bật
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Featured Products
        </h2>
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
                  {/* Sử dụng ProductCard đã được thu nhỏ */}
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Nút trượt qua lại, ẩn trên điện thoại */}
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}

export default FeaturedProducts;
