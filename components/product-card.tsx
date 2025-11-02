"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { ShoppingCart, Star, Loader2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard component (Compact Design)
 */
function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    // Thẻ cha (với p-0 và flex-col)
    <Card className="overflow-hidden h-full flex flex-col p-0">
      {/* 1. PHẦN HÌNH ẢNH*/}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-white">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain transition-transform group-hover:scale-105"
          />
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

        <div className="mt-2">
          {product.salePrice ? (
            <div className="flex items-baseline gap-2">
              <p className="font-bold text-lg text-red-600">
                ${product.salePrice.toFixed(2)}
              </p>
              <p className="font-medium text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
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
