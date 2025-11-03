"use client";

import { Product, Review } from "@/lib/types";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress"; // Component bạn đã cài ở bước trước
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
  product: Product;
}

/**
 * Component hiển thị đầy đủ Đánh giá (Reviews)
 * (Mô phỏng theo Best Buy)
 */
export default function ProductReviews({ product }: ProductReviewsProps) {
  const reviews = product.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="py-4">
        <p className="text-muted-foreground">
          No reviews for this product yet.
        </p>
      </div>
    );
  }

  // --- Tính toán thống kê ---
  const totalReviews = reviews.length;
  // Tính tổng rating, sau đó chia cho tổng số review, làm tròn 1 chữ số
  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
  ).toFixed(1);

  // Đếm số lượng cho mỗi loại sao
  const ratingCounts = [0, 0, 0, 0, 0]; // (Index 0 = 1 sao, ... Index 4 = 5 sao)
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });
  // Đảo ngược mảng để 5 sao lên đầu
  ratingCounts.reverse(); // [5-sao, 4-sao, 3-sao, 2-sao, 1-sao]

  // --- Component con ---

  // Hiển thị các ngôi sao (vàng hoặc xám)
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-5 w-5",
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground/50"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CỘT 1: Tóm tắt (Rating Summary) */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">Reviews</h3>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">{avgRating}</span>
            {renderStars(Math.round(Number(avgRating)))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {totalReviews} Reviews
          </p>

          {/* Thanh thống kê (Rating Bars) */}
          <div className="mt-6 space-y-3">
            {ratingCounts.map((count, index) => {
              const starLevel = 5 - index; // (5, 4, 3, 2, 1)
              const percentage = (count / totalReviews) * 100;
              return (
                <div key={starLevel} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{starLevel}</span>
                  <Star className="h-4 w-4 fill-muted text-muted-foreground/50" />
                  <Progress value={percentage} className="w-full h-2" />
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT 2: Danh sách bình luận */}
        <div className="md:col-span-2 space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              {/* Sao của review này */}
              {renderStars(review.rating)}
              {/* Tiêu đề */}
              <h4 className="font-semibold text-lg mt-2">{review.title}</h4>
              {/* Tác giả và Ngày */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>By {review.author}</span>
                <span>|</span>
                <span>{review.date}</span>
                {review.isVerified && (
                  <span className="text-green-600 font-medium">
                    (Verified Purchaser)
                  </span>
                )}
              </div>
              {/* Nội dung bình luận */}
              <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
