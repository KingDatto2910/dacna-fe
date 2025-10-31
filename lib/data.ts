import { Product, Category } from "./types";

const products: Product[] = [
  {
    id: "1",
    name: "Minimal Desk Lamp",
    description: "A sleek, adjustable desk lamp with minimalist design.",
    price: 49.99,
    image: "/placeholder/desklamp.jpg",
    category: "Electronics",
  },
  {
    id: "2",
    name: "LG Air Conditioner",
    description: "Convenient and suitable for busy family.",
    price: 199.99,
    image: "/product/ac.png",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Mechanical keyboard",
    description: "Modernize your typing experience.",
    price: 129.99,
    image: "/product/keyboard.jpg",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug with minimalist design.",
    price: 24.99,
    image: "/placeholder/400x400.svg",
    category: "Kitchen",
  },
  {
    id: "5",
    name: "Bosch dishwasher",
    description: "Best dishwasher in the market.",
    price: 59.99,
    image: "/placeholder/dishwasher.png",
    category: "Kitchen",
  },
  {
    id: "6",
    name: "Smart phone",
    description: "New gen of smartphone.",
    price: 249.99,
    image: "/placeholder/iphone4.jpg",
    category: "Electronics",
  },
  {
    id: "7",
    name: "LG Washer",
    description: "Premium washing machine.",
    price: 29.99,
    image: "/product/washer.png",
    category: "Laundry",
  },
  {
    id: "8",
    name: "Bluetooth Speaker",
    description: "Portable bluetooth speaker with rich sound quality.",
    price: 79.99,
    image: "/placeholder/speaker.webp",
    category: "Electronics",
  },
];

const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    image: "/placeholder/electronics-cate.png",
  },
  {
    id: "2",
    name: "Cleaning",
    slug: "cleaning",
    image: "/placeholder/cleaning-cate.png",
  },
  {
    id: "3",
    name: "Laundry",
    slug: "laundry",
    image: "/placeholder/laundry-cate.png",
  },
  {
    id: "4",
    name: "Furniture",
    slug: "furniture",
    image: "/placeholder/furniture-cate.png",
  },
  {
    id: "5",
    name: "Kitchen",
    slug: "kitchen",
    image: "/placeholder/kitchen-cate.png",
  },
  {
    id: "6",
    name: "Accessories",
    slug: "accessories",
    image: "/placeholder/300x300.svg",
  },
];

/**
 * Retrieves all products.
 * @returns {Product[]} An array of all product objects.
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Retrieves the first 4 products from the list.
 * @returns {Product[]} An array of the first 4 product objects.
 */
export function getFeaturedProducts(): Product[] {
  return products.slice(0, 4);
}

/**
 * Retrieves a product by its unique identifier.
 * @param {string} id - The unique identifier of the product.
 * @returns {Product | undefined} The product object if found, otherwise undefined.
 */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/**
 * Retrieves all categories.
 * @returns {Category[]} An array of all category objects.
 */
export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  // Find and return the category with the matching slug
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(categoryName: string): Product[] {
  return products.filter((product) => product.category === categoryName);
}
