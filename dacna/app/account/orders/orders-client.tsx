// dacna/app/account/orders/orders-client.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { apiGetMyOrders, apiGetOrderDetail, Order } from "@/lib/order-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Component hiển thị chi tiết đơn hàng
function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Order #{order.order_code}</CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Status</p>
              <Badge
                variant={
                  order.order_status === "paid"
                    ? "default"
                    : order.order_status === "awaiting_payment"
                    ? "secondary"
                    : "outline"
                }
              >
                {order.order_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge
                variant={
                  order.payment_status === "paid" ? "default" : "outline"
                }
              >
                {order.payment_status || "Unpaid"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">
                {order.payment_method || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Items</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.name || item.product?.name}</TableCell>
                      <TableCell>{item.qty || item.quantity}</TableCell>
                      <TableCell>
                        ₫
                        {Number(
                          item.unit_price || item.product?.price
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₫
                        {Number(
                          item.amount ||
                            (item.unit_price || item.product?.price) *
                              (item.qty || item.quantity)
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p className="font-medium">₫{order.subtotal.toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping Fee</p>
              <p className="font-medium">
                ₫{order.shipping_fee.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <p>Total</p>
              <p>₫{order.grand_total.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersClient() {
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load orders
  useEffect(() => {
    if (isAuthenticated && token) {
      loadOrders();
    }
  }, [isAuthenticated, token]);

  const loadOrders = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const ordersData = await apiGetMyOrders(token);
      setOrders(ordersData);
    } catch (error: any) {
      console.error("Failed to load orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (orderId: number) => {
    if (!token) return;

    try {
      const orderDetail = await apiGetOrderDetail(token, orderId);
      setSelectedOrder(orderDetail);
    } catch (error: any) {
      console.error("Failed to load order detail:", error);
      toast.error(error.message || "Failed to load order detail");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "awaiting_payment":
        return "secondary";
      case "shipping":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            View your order history and track your purchases
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/account">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              You haven't placed any orders yet.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Code</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.order_code}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(order.order_status)}
                      >
                        {order.order_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.payment_status === "paid"
                            ? "default"
                            : "outline"
                        }
                      >
                        {order.payment_status || "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₫{order.grand_total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(order.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default OrdersClient;
