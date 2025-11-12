"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card";
import { Product } from "@/lib/types";
import { getProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryClientProps {
  initialProducts: Product[];
  categorySlug: string;
  subCategorySlug?: string;
}

export default function CategoryClient({
  initialProducts,
  categorySlug,
  subCategorySlug,
}: CategoryClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Calculate min/max price from products
  const minPrice = Math.floor(
    Math.min(...initialProducts.map((p) => p.salePrice || p.price)) || 0
  );
  const maxPrice = Math.ceil(
    Math.max(...initialProducts.map((p) => p.salePrice || p.price)) || 10000
  );

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Fetch products when filters change
  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const filteredProducts = await getProducts({
          categorySlug: categorySlug,
          subCategorySlug: subCategorySlug,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortBy,
        });
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Failed to fetch filtered products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [categorySlug, subCategorySlug, priceRange, sortBy]);

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handleClearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSortBy("newest");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - Filter */}
      <aside className="lg:col-span-1">
        <div className="space-y-6 sticky top-4">
          {/* Reset button */}
          <div>
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-4">Price Range</h4>
            <div className="space-y-4">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={(value) =>
                  handlePriceChange(value as [number, number])
                }
                className="mt-6"
              />
              <div className="flex items-center justify-between">
                <div className="border rounded-md px-2 py-1 w-20 text-sm">
                  ${priceRange[0]}
                </div>
                <div className="border rounded-md px-2 py-1 w-20 text-right text-sm">
                  ${priceRange[1]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <section className="lg:col-span-3">
        {/* Header with count and sort */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${products.length} products found`}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sorted By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-asc")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-desc")}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("rating")}>
                Highest Rated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No products found matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
