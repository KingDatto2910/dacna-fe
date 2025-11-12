export interface Specification {
  key: string;
  value: string;
}
export interface StockInfo {
  level: "in-stock" | "low-stock" | "out-of-stock";
  storeAddress: string;
}
export interface Review {
  id: number;
  rating: number;
  title?: string;
  author: string;
  date: string;
  comment: string;
  isVerified: boolean;
  user_id?: number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categorySlug: string;
  subCategory?: string;
  subCategorySlug?: string;
  salePrice?: number;
  rating?: number;
  reviewCount?: number;
  isBestSeller?: boolean;
  isTrending?: boolean;
  sku?: string;
  model?: string;
  specifications?: Specification[];
  stock?: StockInfo;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  // images: string[];
  images_url: string;
  subCategories?: SubCategory[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// (THÊM MỚI) Kiểu dữ liệu cho Form Đăng ký
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
