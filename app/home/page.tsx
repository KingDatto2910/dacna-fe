"use client";

import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  getHotDeals,
  getTrendingProducts,
  getTopRatedProducts,
  getFeaturedProducts,
} from "@/lib/data";
// Import các component kệ hàng
import ProductCarousel from "@/components/product-carousel";
import PromoShelf from "@/components/promote-shelf";
import InfoShelf from "@/components/info-shelf";
import { Star } from "lucide-react";

/**
 * Trang chủ cửa hàng
 */
function Home() {
  const hotDeals = getHotDeals();
  const trendingProducts = getTrendingProducts();
  const topRatedProducts = getTopRatedProducts();
  const featuredProducts = getFeaturedProducts();

  const topRatedIcon = (
    <div className="flex items-center text-yellow-400">
      <Star className="h-5 w-5 fill-yellow-400" />
      <Star className="h-5 w-5 fill-yellow-400" />
      <Star className="h-5 w-5 fill-yellow-400" />
      <Star className="h-5 w-5 fill-yellow-400" />
      <Star className="h-5 w-5 fill-yellow-400" />
      <span className="text-sm font-bold text-foreground ml-2">4.5 & up</span>
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:px-8 space-y-12">
        {/* Kệ hàng 1: Hot Deals */}
        <ProductCarousel
          title="Hot Deals"
          products={hotDeals}
          keyPrefix="hot"
        />

        {/* Kệ hàng 2: "Công thức 2" (Banner + Carousel) */}
        <PromoShelf
          title="Recommended For You"
          products={featuredProducts}
          keyPrefix="promo"
          bannerImage="/placeholder/banner.jpg"
          bannerLink="/products"
        />

        {/* Kệ hàng 3: Trending Products */}
        <ProductCarousel
          title="Trending Now"
          products={trendingProducts}
          keyPrefix="trending"
        />

        <InfoShelf
          infoBoxTitle="Top Rated"
          infoBoxDescription="Explore products rated highest by real customers."
          infoBoxIcon={topRatedIcon}
          carouselProducts={topRatedProducts}
          carouselKeyPrefix="toprated-shelf"
        />

        {/* Kệ hàng Danh mục */}
        <Categories />
      </div>

      <Footer />
    </>
  );
}

export default Home;
