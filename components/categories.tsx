import { getAllCategories } from "@/lib/data";
import CategoryCard from "./category-card";
// Import các component Carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/**
 * The Categories component
 */
function Categories() {
  const categories = getAllCategories();

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Shop by Category
        </h2>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {categories.map((category) => (
              // Ép các Card nhỏ lại, 8-10 card một hàng
              <CarouselItem
                key={category.id}
                className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 xl:basis-1/10 pl-2"
              >
                <div className="p-1 h-full">
                  <CategoryCard category={category} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}

export default Categories;
