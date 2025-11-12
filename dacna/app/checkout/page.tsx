"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  apiCreateOrder,
  apiCheckoutOrder,
  apiPayOrder,
  CreateOrderData,
} from "@/lib/order-api";
import { apiGetMyCart, apiUpsertCartItem } from "@/lib/cart-api";
import { getCategories } from "@/lib/api";
import { Category } from "@/lib/types";

/**
 * Trang Checkout
 */
export default function CheckoutPage() {
  const { items, subtotal, clearCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [dbCartId, setDbCartId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Lấy cart ID từ database nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && token) {
      apiGetMyCart(token)
        .then((cart) => {
          setDbCartId(cart.id);
        })
        .catch((err) => {
          console.error("Failed to get cart:", err);
        });
    }
  }, [isAuthenticated, token]);

  // Load categories cho Navbar
  useEffect(() => {
    getCategories()
      .then((cats) => {
        setCategories(cats);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setCategories([]); // Set empty array để tránh lỗi
      });
  }, []);

  // (REMOVED) Authentication redirect - allow guest checkout

  const shippingFee = subtotal > 500000 ? 0 : 30000; // VND
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      // Lấy thông tin từ form
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      // Build orderData without undefined values
      const orderData: CreateOrderData = {
        address_street: formData.get("address") as string,
        address_city: formData.get("city") as string,
      };

      const district = formData.get("district") as string;
      const ward = formData.get("ward") as string;

      if (district && district.trim()) {
        orderData.address_district = district;
      }
      if (ward && ward.trim()) {
        orderData.address_ward = ward;
      }

      // Guest checkout (no authentication)
      if (!isAuthenticated || !token) {
        // For guest users, we need to create an order without token
        // The backend should handle this by setting user_id to NULL
        toast.info("Processing guest order...");

        // Create guest order (will need backend API support)
        const guestOrderData = {
          ...orderData,
          items: items.map((item) => ({
            product_id: parseInt(item.product.id),
            quantity: item.quantity,
            unit_price: item.product.salePrice ?? item.product.price,
          })),
          payment_method: paymentMethod,
          subtotal: subtotal,
          shipping_fee: shippingFee,
          grand_total: total,
        };

        // Call backend API to create guest order (need to implement this endpoint)
        const response = await fetch("http://localhost:5000/api/orders/guest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(guestOrderData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create guest order");
        }

        const result = await response.json();
        const orderId = result.data.id;
        const orderCode = result.data.order_code;

        toast.success("Order placed successfully!");
        clearCart();
        router.push(
          `/order-success?orderId=${orderId}&code=${encodeURIComponent(
            orderCode
          )}&total=${encodeURIComponent(total.toString())}`
        );
        return;
      }

      // Authenticated user checkout
      // Tạo đơn hàng mới từ giỏ hàng hiện tại
      const newOrder = await apiCreateOrder(token, orderData);
      const orderId = newOrder.id;

      // Copy items từ cart sang order mới
      // Loop qua tất cả items trong cart và thêm vào order mới
      for (const item of items) {
        await apiUpsertCartItem(token, orderId, item.product.id, item.quantity);
      }

      // Checkout đơn hàng
      await apiCheckoutOrder(token, orderId);

      // Thanh toán
      await apiPayOrder(token, orderId, paymentMethod);

      toast.success("Order placed successfully!");
      clearCart();
      router.push(
        `/order-success?orderId=${orderId}&code=${encodeURIComponent(
          newOrder.order_code
        )}&total=${encodeURIComponent(total.toString())}`
      );
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar categories={categories} />
      <div className="container mx-auto px-4 py-12 md:px-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {cartLoading || isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          // Trường hợp giỏ hàng rỗng
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Your cart is empty.
            </p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          // Layout 2 cột - Allow guest and authenticated checkout
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12"
          >
            {/* CỘT BÊN TRÁI: FORM*/}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Billing details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Your Company"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    placeholder="District"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ward">Ward</Label>
                  <Input
                    id="ward"
                    name="ward"
                    placeholder="Ward"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Town / City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="New York"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* CỘT BÊN PHẢI: ĐƠN HÀNG */}
            <div className="mt-12 lg:mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Danh sách sản phẩm */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          ₫
                          {(
                            (item.product.salePrice ?? item.product.price) *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Ô Voucher */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Gift card or discount code"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                    >
                      Apply
                    </Button>
                  </div>

                  <Separator />

                  {/* Tổng tiền */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>₫{subtotal.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Shipping</p>
                      <p>₫{shippingFee.toLocaleString()}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <p>Total</p>
                      <p>₫{total.toLocaleString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Method</h3>
                    <div
                      className={`rounded-md border p-4 ${
                        paymentMethod === "card" ? "border-primary" : ""
                      }`}
                      onClick={() => !isLoading && setPaymentMethod("card")}
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="accent-primary"
                          disabled={isLoading}
                        />
                        Direct Bank Transfer
                      </label>
                      {paymentMethod === "card" && (
                        <p className="mt-2 text-sm text-muted-foreground pl-6">
                          Make your payment directly into our bank account.
                          Please use your Order ID as the payment reference.
                        </p>
                      )}
                    </div>
                    <div
                      className={`rounded-md border p-4 ${
                        paymentMethod === "cod" ? "border-primary" : ""
                      }`}
                      onClick={() => !isLoading && setPaymentMethod("cod")}
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-primary"
                          disabled={isLoading}
                        />
                        Cash On Delivery
                      </label>
                      {paymentMethod === "cod" && (
                        <p className="mt-2 text-sm text-muted-foreground pl-6">
                          Pay with cash upon delivery.
                        </p>
                      )}
                    </div>
                  </div>
                  {/* --- KẾT THÚC SỬA LỖI --- */}
                </CardContent>
                <CardFooter>
                  {/* Nút Place order */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Place order"
                    )}
                  </Button>
                </CardFooter>
              </Card>
              <p className="mt-4 text-xs text-muted-foreground">
                Your personal data will be used...
              </p>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}
