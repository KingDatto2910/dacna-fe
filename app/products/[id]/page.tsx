"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ProductGallery } from "@/components/product-gallery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/product-card";
import Breadcrumbs from "@/components/breadcrumbs";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const { recentlyViewedProducts } = useRecentlyViewed(product);

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const fetchedProduct = getProductById(id);

      if (fetchedProduct) {
        setProduct(fetchedProduct);
        const related = getRelatedProducts(
          fetchedProduct.id,
          fetchedProduct.category
        );
        setRelatedProducts(related);
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          Loading product...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          Product not found.
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    setIsCartLoading(true);
    addToCart(product);
    setTimeout(() => {
      setIsCartLoading(false);
    }, 500);
  };
  const handleSave = () => {
    if (!product) return;
    setIsSaveLoading(true);
    toast.success(`${product.name} saved to favorites!`);
    setTimeout(() => {
      setIsSaveLoading(false);
    }, 500);
  };
  const handleBuyNow = () => {
    if (!product) return;
    setIsBuyNowLoading(true);
    addToCart(product);
    toast.info("Redirecting to checkout...");
    setTimeout(() => {
      router.push("/checkout");
    }, 800);
  };

  const displayPrice = product.salePrice ?? product.price;
  const filteredRecentlyViewed = recentlyViewedProducts.filter(
    (p) => p.id !== product.id
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1">
        <Breadcrumbs />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Cột 1: Gallery */}
          <div className="md:col-span-3">
            <ProductGallery product={product} />
          </div>
          {/* Cột 2: Thông tin */}
          <div className="md:col-span-2 space-y-5">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground">
              {product.model && (
                <div>
                  <strong>Model:</strong> {product.model}
                </div>
              )}
              {product.sku && (
                <div>
                  <strong>SKU:</strong> {product.sku}
                </div>
              )}
            </div>

            {/* Giá */}
            <div className="space-y-1">
              {product.salePrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">
                    ${displayPrice.toFixed(2)}
                  </span>
                  <span className="text-xl font-medium text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">
                  ${displayPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Khối Nút Bấm */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-1/2"
                  size="lg"
                  disabled={isCartLoading}
                >
                  {isCartLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  size="lg"
                  className="w-1/2"
                  disabled={isSaveLoading}
                >
                  {isSaveLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className="mr-2 h-5 w-5" />
                  )}
                  {isSaveLoading ? "Saving..." : "Save"}
                </Button>
              </div>
              <Button
                onClick={handleBuyNow}
                className="w-full"
                size="lg"
                disabled={isBuyNowLoading}
              >
                {isBuyNowLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Buy Now"
                )}
              </Button>
            </div>

            {/* Thông tin Stock */}
            {product.stock && (
              <Card className="bg-muted/50 border-dashed p-4">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="font-medium">
                        {product.stock.level === "in-stock" && "In Stock"}
                        {product.stock.level === "low-stock" && "Low Stock"}
                        {product.stock.level === "out-of-stock" &&
                          "Out of Stock"}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {product.stock.storeAddress}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Khu vực Accordion */}
        <div className="mt-16 border-t pt-8">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold">
                  Specifications
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-4">
                    <div className="flex flex-col text-sm">
                      {product.specifications.map((spec, index) => (
                        <div
                          key={spec.key}
                          className={cn(
                            "flex justify-between items-center p-3 rounded-md",
                            index % 2 === 0 ? "bg-muted/50" : ""
                          )}
                        >
                          <span className="font-medium">{spec.key}</span>
                          <span className="text-muted-foreground text-right">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Features (Mô tả) */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                Features
              </AccordionTrigger>
              <AccordionContent className="pt-4 text-base">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Kệ hàng "Related Items" */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Related Items
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {relatedProducts.map((relatedProd) => (
                  <CarouselItem
                    key={`related-${relatedProd.id}`}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2"
                  >
                    <div className="p-1 h-full">
                      <ProductCard product={relatedProd} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}

        {/* Kệ hàng "Recently Viewed" */}
        {filteredRecentlyViewed.length > 0 && (
          <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Recently Viewed
            </h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {filteredRecentlyViewed.map((viewedProd) => (
                  <CarouselItem
                    key={`viewed-${viewedProd.id}`}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2"
                  >
                    <div className="p-1 h-full">
                      <ProductCard product={viewedProd} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
