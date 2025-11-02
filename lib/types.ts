export interface Specification {
  key: string;
  value: string;
}
export interface StockInfo {
  level: "in-stock" | "low-stock" | "out-of-stock";
  storeAddress: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  salePrice?: number;
  rating?: number;
  reviewCount?: number;
  isBestSeller?: boolean;
  isTrending?: boolean;
  sku?: string;
  model?: string;
  specifications?: Specification[];
  stock?: StockInfo;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
