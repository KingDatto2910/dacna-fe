"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
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

/**
 * Checkout Page
 * Displays the billing details form and the order summary.
 */
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("bank");

  // Calculate totals. You can add logic for shipping, taxes here.
  const shippingFee = subtotal > 500 ? 0 : 5; // Example: Free shipping for orders > $500
  const total = subtotal + shippingFee;

  /**
   * Handles the order placement
   */
  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault();
    // 1. Collect data from the form (you need to add state to manage inputs)
    // 2. Send data (form info + 'items') to your API/server
    // 3. Handle the result...

    // Placeholder logic:
    alert("Order placed successfully!");
    clearCart(); // Clear the cart after successful order
    router.push("/home"); // Redirect to homepage
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:px-8">
        {/* Breadcrumbs (like the PDF) */}
        <div className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>{" "}
          &gt; <span>Checkout</span>
        </div>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {items.length === 0 ? (
          // Case: Cart is empty
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Your cart is empty.
            </p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          // Layout: 2 columns when cart has items
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12"
          >
            {/* ------------------- */}
            {/* LEFT COLUMN: FORM   */}
            {/* ------------------- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Billing details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street address</Label>
                <Input id="address" placeholder="123 Main St" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Town / City</Label>
                <Input id="city" placeholder="New York" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* ------------------- */}
            {/* RIGHT COLUMN: ORDER */}
            {/* ------------------- */}
            <div className="mt-12 lg:mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product List */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: 1
                            </p>{" "}
                            {/* Temp: 1, as cart logic doesn't support quantity */}
                          </div>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Shipping</p>
                      <p>${shippingFee.toFixed(2)}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <p>Total</p>
                      <p>${total.toFixed(2)}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Method</h3>
                    <div
                      className={`rounded-md border p-4 ${
                        paymentMethod === "bank" ? "border-primary" : ""
                      }`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethod === "bank"}
                          onChange={() => setPaymentMethod("bank")}
                          className="accent-primary"
                        />
                        Direct Bank Transfer
                      </label>
                      {paymentMethod === "bank" && (
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
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-primary"
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
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" size="lg">
                    Place order
                  </Button>
                </CardFooter>
              </Card>
              <p className="mt-4 text-xs text-muted-foreground">
                Your personal data will be used to support your experience
                throughout this website...
              </p>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
}
