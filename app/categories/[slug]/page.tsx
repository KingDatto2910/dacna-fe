// Tệp này vẫn là Server Component (không có "use client")
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link"; 
import { ChevronRightIcon } from "lucide-react"; 

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.name);

  return (
    <>
      <Navbar />
      <section className="w-full py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm text-muted-foreground"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/home" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <ChevronRightIcon className="h-4 w-4" />
              <li>
                
                <Link href="/categories" className="hover:text-primary">
                  Categories
                </Link>
              </li>
              <ChevronRightIcon className="h-4 w-4" />
              <li>
                <span className="font-medium text-foreground">
                  {category.name}
                </span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium">
                No products found in this category
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
