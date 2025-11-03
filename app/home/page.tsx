"use client";

import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import HeroBanner from "@/components/hero-banner";
import HeroSection from "@/components/hero-section";
import PromoGrid from "@/components/promo-grid";
import {
  getHotDeals,
  getTrendingProducts,
  getTopRatedProducts,
  getFeaturedProducts,
  getBestSellingProducts,
} from "@/lib/data";
import ProductCarousel from "@/components/product-carousel";
import PromoShelf from "@/components/promote-shelf";
import InfoShelf from "@/components/info-shelf";
import { Star } from "lucide-react";
import AnimateOnScroll from "@/components/animate-on-scroll";

/**
 * Trang chủ cửa hàng
 */
function Home() {
  const hotDeals = getHotDeals();
  const trendingProducts = getTrendingProducts();
  const topRatedProducts = getTopRatedProducts();
  const featuredProducts = getFeaturedProducts();
  const bestSellingProducts = getBestSellingProducts();

  const topRatedIcon = (
    <div className="flex items-center text-yellow-400">
      <Star className="h-6 w-6 fill-current" />
      <Star className="h-6 w-6 fill-current" />
      <Star className="h-6 w-6 fill-current" />
      <Star className="h-6 w-6 fill-current" />
      <Star className="h-6 w-6 fill-current" />
    </div>
  );

  const bestSellingIcon = (
    <div className="text-blue-600">
      <Star className="h-6 w-6 fill-current" />
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:px-8 space-y-4">
        <AnimateOnScroll>
          <HeroSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <HeroBanner />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <PromoGrid />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ProductCarousel
            title="Hot Deals"
            products={hotDeals}
            keyPrefix="hot"
          />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <PromoShelf
            title="Recommended For You"
            products={featuredProducts}
            keyPrefix="promo"
            bannerImage="/placeholder/banner.jpg" // (Nhớ thay ảnh banner)
            bannerLink="/products"
          />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <ProductCarousel
            title="Trending Now"
            products={trendingProducts}
            keyPrefix="trending"
          />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <InfoShelf
            infoBoxTitle="Top Rated"
            infoBoxDescription="Explore products rated highest by real customers."
            infoBoxIcon={topRatedIcon}
            carouselProducts={topRatedProducts}
            keyPrefix="toprated-shelf"
          />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <InfoShelf
            infoBoxTitle="Best Selling"
            infoBoxDescription="Customer favorites topping monthly sales charts."
            infoBoxIcon={bestSellingIcon}
            carouselProducts={bestSellingProducts}
            keyPrefix="bestselling-shelf"
          />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <Categories />
        </AnimateOnScroll>
      </div>

      <Footer />
    </>
  );
}

export default Home;
