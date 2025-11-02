"use client";

import { Product, CartItem } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      try {
        const parsedItems = JSON.parse(cart);

        if (parsedItems.length > 0 && parsedItems[0].product !== undefined) {
          // Đây là định dạng mới (CartItem[]), an toàn để load
          setItems(parsedItems);
        } else if (parsedItems.length === 0) {
          // Giỏ hàng rỗng, an toàn để load
          setItems([]);
        } else {
          console.warn("Old cart format detected. Clearing cart.");
          localStorage.removeItem("cart");
          setItems([]);
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage, clearing.", e);
        localStorage.removeItem("cart"); // Xóa dữ liệu hỏng
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  const { totalItems, subtotal } = useMemo(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => {
      // Vì chúng ta đã dọn dẹp ở useEffect, 'item.product' ở đây sẽ luôn an toàn
      const price = item.product.salePrice ?? item.product.price;
      return total + price * item.quantity;
    }, 0);

    return { totalItems, subtotal };
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      );
      let newItems: CartItem[];
      if (existingItemIndex !== -1) {
        newItems = currentItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        newItems = [...currentItems, { product: product, quantity: 1 }];
      }
      toast.success(`${product.name} added to cart!`);
      return newItems;
    });
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    setItems((currentItems) => {
      if (newQuantity <= 0) {
        return currentItems.filter((item) => item.product.id !== productId);
      } else {
        return currentItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => {
      return currentItems.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart must be used within a CartProvider. " +
        "Make sure you have wrapped your app with the CartProvider component."
    );
  }
  return context;
}
