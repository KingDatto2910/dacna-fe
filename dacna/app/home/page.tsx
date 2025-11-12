// fe/app/home/page.tsx
import AnimateOnScroll from "@/components/animate-on-scroll";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import HeroBanner from "@/components/hero-banner";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import ProductCarousel from "@/components/product-carousel";
import PromoGrid from "@/components/promo-grid";

//Import hàm API thật VÀ CÁC TYPES
import { getCategories, getProducts } from "@/lib/api";
import { Product, Category } from "@/lib/types";

export default async function HomePage() {
  //Khai báo rõ ràng kiểu dữ liệu cho categories
  let categories: Category[] = [];
  let trendingProducts: Product[] = [];
  let bestSellingProducts: Product[] = [];
  let topRatedProducts: Product[] = [];

  try {
    const rawCategories = await getCategories();
    // Map images_url để sử dụng file -cate.png
    categories = rawCategories.map((cat) => ({
      ...cat,
      images_url: `/placeholder/${cat.slug}-cate.png`,
    }));
    trendingProducts = await getProducts({ trending: true });
    bestSellingProducts = await getProducts({ bestseller: true });
    topRatedProducts = await getProducts({ toprated: true });
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    // Nếu API lỗi, các mảng này vẫn rỗng và trang không bị crash
  }

  return (
    <>
      <Navbar categories={categories} />

      <main className="container mx-auto px-4 md:px-8 space-y-8 my-8">
        <AnimateOnScroll>
          <HeroSection />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <HeroBanner />
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          {/* Giờ 'categories' đã được hiểu là 'Category[]' */}
          <Categories categories={categories} />
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.2}>
          <PromoGrid />
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.3}>
          <ProductCarousel
            title="🔥 Trending Now"
            products={trendingProducts}
            keyPrefix="trending"
            bannerImage="/placeholder/banner.jpg"
            bannerAlt="Trending Products"
          />
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.4}>
          <ProductCarousel
            title="⭐ Best Sellers"
            products={bestSellingProducts}
            keyPrefix="bestseller"
            bannerImage="/placeholder/bookshelf.jpg"
            bannerAlt="Best Selling Products"
          />
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.5}>
          <ProductCarousel
            title="🏆 Top Rated"
            products={topRatedProducts}
            keyPrefix="toprated"
            bannerImage="/placeholder/drone.jpg"
            bannerAlt="Top Rated Products"
          />
        </AnimateOnScroll>
      </main>
      <Footer />
    </>
  );
}
