"use client";

import { Product, CartItem } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { toast } from "sonner";

// 1. Import các công cụ mới
import { useAuth } from "./use-auth";
import {
  apiGetMyCart,
  apiUpsertCartItem,
  apiRemoveCartItem,
  DbCartItem, // Import kiểu dữ liệu từ cart-api
} from "@/lib/cart-api";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isLoading: boolean; // Cờ báo đang tải giỏ hàng
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const initialCartState: CartItem[] = [];

/**
 * 2. HÀM CHUYỂN ĐỔI (QUAN TRỌNG)
 * Biến dữ liệu thô từ CSDL (DbCartItem) thành dữ liệu FE (CartItem)
 */
function convertDbItemToFeItem(dbItem: DbCartItem): CartItem {
  // "Tạo giả" một đối tượng Product từ thông tin DB
  const product: Product = {
    id: dbItem.product_id.toString(),
    name: dbItem.name,
    // Dùng unit_price (giá tại thời điểm mua) làm giá gốc
    price: parseFloat(dbItem.unit_price as any),
    images: [dbItem.image_url || "/placeholder.svg"], // Lấy ảnh

    // Các trường này không quá quan trọng trong giỏ hàng
    // nhưng cần thiết để khớp kiểu 'Product'
    description: "",
    category: "",
    categorySlug: "",
    sku: dbItem.sku,
    model: dbItem.model || undefined,
  };

  return {
    product: product,
    quantity: dbItem.qty,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  // 3. LẤY NGỮ CẢNH AUTH
  const { isAuthenticated, token } = useAuth();

  const [items, setItems] = useState<CartItem[]>(initialCartState);
  const [dbCartId, setDbCartId] = useState<number | null>(null); // State chứa Order ID
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 4. HÀM TẢI GIỎ HÀNG (Logic Chuyển đổi Ngữ cảnh)
   */
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setItems([]); // Xóa giỏ hàng cũ ngay lập tức

    try {
      if (isAuthenticated && token) {
        // ========== LUỒNG USER (Đã đăng nhập) ==========
        const dbCart = await apiGetMyCart(token);
        setDbCartId(dbCart.id); // Lưu lại ID giỏ hàng CSDL

        // Dùng hàm chuyển đổi để đưa về dạng CartItem
        const feItems = dbCart.items.map(convertDbItemToFeItem);
        setItems(feItems);
      } else {
        // ========== LUỒNG KHÁCH (Guest) ==========
        const cart = localStorage.getItem("cart");
        setItems(cart ? JSON.parse(cart) : []);
        setDbCartId(null); // Không có ID giỏ hàng CSDL
      }
    } catch (error: any) {
      // Nếu Unauthorized thì fallback sang guest, không hiện toast
      if (error?.message === "UNAUTHORIZED") {
        const cart = localStorage.getItem("cart");
        setItems(cart ? JSON.parse(cart) : []);
        setDbCartId(null);
      } else {
        toast.error(`Failed to load cart: ${error.message}`);
        setItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]); // <--- Chạy lại khi Đăng nhập/Đăng xuất

  // 5. TỰ ĐỘNG TẢI LẠI KHI AUTH THAY ĐỔI
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // 6. LƯU LOCALSTORAGE (Chỉ khi là khách)
  useEffect(() => {
    // Chỉ lưu vào localStorage nếu là Khách
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  /**
   * 7. HÀM ADD TO CART (Phân luồng)
   */
  const addToCart = async (product: Product) => {
    const existingItem = items.find((i) => i.product.id === product.id);
    const newQty = (existingItem?.quantity || 0) + 1;

    if (isAuthenticated && token && dbCartId) {
      // === LUỒNG DB (USER) ===
      try {
        // Gọi API
        await apiUpsertCartItem(token, dbCartId, product.id, newQty);

        // Cập nhật state FE
        setItems((prev) =>
          existingItem
            ? prev.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQty }
                  : item
              )
            : [...prev, { product, quantity: 1 }]
        );
        toast.success(`${product.name} added to cart!`);
      } catch (error: any) {
        toast.error(`Failed to add item: ${error.message}`);
      }
    } else {
      // === LUỒNG LOCALSTORAGE (KHÁCH) ===
      setItems((prev) =>
        existingItem
          ? prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQty }
                : item
            )
          : [...prev, { product, quantity: 1 }]
      );
      toast.success(`${product.name} added to cart!`);
    }
  };

  /**
   * 8. HÀM UPDATE QUANTITY (Phân luồng)
   */
  const updateItemQuantity = async (productId: string, newQuantity: number) => {
    if (isAuthenticated && token && dbCartId) {
      // === LUỒNG DB (USER) ===
      try {
        if (newQuantity <= 0) {
          // Nếu số lượng <= 0 thì gọi API xoá item thay vì upsert 0 (backend không cho 0)
          await apiRemoveCartItem(token, dbCartId, productId);
          setItems((prev) => prev.filter((i) => i.product.id !== productId));
        } else {
          await apiUpsertCartItem(token, dbCartId, productId, newQuantity);
          // Cập nhật state FE
          setItems((prev) =>
            prev.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
        }
      } catch (error: any) {
        toast.error(`Failed to update quantity: ${error.message}`);
      }
    } else {
      // === LUỒNG LOCALSTORAGE (KHÁCH) ===
      setItems((prev) =>
        prev
          .map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    }
  };

  /**
   * 9. HÀM REMOVE FROM CART (Phân luồng)
   */
  const removeFromCart = async (productId: string) => {
    if (isAuthenticated && token && dbCartId) {
      // === LUỒNG DB (USER) ===
      try {
        await apiRemoveCartItem(token, dbCartId, productId);
        // Cập nhật state FE
        setItems((prev) =>
          prev.filter((item) => item.product.id !== productId)
        );
      } catch (error: any) {
        toast.error(`Failed to remove item: ${error.message}`);
      }
    } else {
      // === LUỒNG LOCALSTORAGE (KHÁCH) ===
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    }
  };

  // (Hàm này cần nâng cấp tương tự)
  const clearCart = () => {
    if (isAuthenticated) {
      // TODO: Gọi API xóa hàng loạt
      console.warn("clearCart() API not implemented yet");
      setItems([]);
    } else {
      setItems([]);
    }
  };

  // Tính toán (Giữ nguyên)
  const { totalItems, subtotal } = useMemo(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return total + price * item.quantity;
    }, 0);

    return { totalItems, subtotal };
  }, [items]);

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
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
