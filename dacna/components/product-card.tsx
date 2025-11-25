"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { ShoppingCart, Star, Loader2, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard component (Compact Design)
 */
function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();

  // Logic hiển thị sao (rating)
  const renderStars = () => {
    const fullStars = Math.floor(product.rating || 0);
    const halfStar = (product.rating || 0) % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {halfStar && (
          <Star
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
          />
        )}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  // Hàm xử lý Add to Cart (có loading)
  const handleAddToCart = () => {
    setIsLoading(true);
    addToCart(product);
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // 0.5 giây delay
  };

  const fav = isFavorited(Number(product.id));
  // Defensive numeric casting to avoid toFixed errors if backend returns strings
  const priceValue = Number(product.price) || 0;
  const salePriceValue = product.salePrice !== undefined && product.salePrice !== null ? Number(product.salePrice) : undefined;

  return (
    <Card className="overflow-hidden h-full flex flex-col p-0 relative group">
      {/* 1. PHẦN HÌNH ẢNH*/}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-white">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain transition-transform group-hover:scale-105"
          />
          {/* Favorite button overlay */}
          <button
            type="button"
            aria-label="Favorite"
            onClick={(e) => { e.preventDefault(); toggleFavorite(Number(product.id)); }}
            className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur px-2 py-2 shadow hover:bg-white transition"
          >
            <Heart className={`h-4 w-4 ${fav ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
        </div>
      </Link>

      {/* 2. KHỐI NỘI DUNG*/}
      <CardContent className="p-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary hover:underline">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            {renderStars()}
            <span className="text-xs text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}
        {/* Price Section */}
        <div className="mt-2">
          {salePriceValue !== undefined ? (
            <div className="flex items-baseline gap-2">
              <p className="font-bold text-lg text-red-600">${salePriceValue.toFixed(2)}</p>
              {/* text-red-600 is the display of salePrice */}
              <p className="font-medium text-sm text-gray-500 line-through">
                ${priceValue.toFixed(2)}
              </p>
              {/* text-gray-500 is the display of original price, line-through is the horizontal line cut through */}
            </div>
          ) : (
            <p className="font-bold text-lg">${priceValue.toFixed(2)}</p>
          )}
        </div>
      </CardContent>

      {/* 3. KHỐI NÚT BẤM*/}
      <div className="p-3 pt-0 mt-auto">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
