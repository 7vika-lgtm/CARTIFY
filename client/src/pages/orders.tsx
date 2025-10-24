import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Download, ShoppingCart, Receipt, QrCode } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { type Order } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const [location] = useLocation();
  const { userId } = useCart();
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if we're showing order success
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const orderSuccess = urlParams.get('orderSuccess');
    if (orderSuccess) {
      setShowSuccess(true);
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${orderSuccess} has been confirmed`,
      });
    }
  }, [location, toast]);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["/api/orders", userId],
    select: (data: Order[]) => data,
  });

  const QRCodePattern = ({ orderId }: { orderId: string }) => (
    <div className="w-32 h-32 mx-auto bg-gray-900 rounded-lg relative overflow-hidden">
      <div className="absolute inset-2 bg-white rounded-sm">
        <div className="grid grid-cols-8 gap-px p-1 h-full">
          {/* Simple QR code pattern based on order ID */}
          {Array.from({ length: 64 }, (_, i) => {
            const shouldFill = (orderId.charCodeAt(i % orderId.length) + i) % 3 === 0;
            return (
              <div
                key={i}
                className={shouldFill ? "bg-gray-900 rounded-sm" : "bg-white"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-foreground mb-6">Your Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-foreground mb-6">Your Orders</h2>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load orders. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-foreground mb-6">Your Orders</h2>
        
        <div className="text-center py-12">
          <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link href="/scanner">
            <Button data-testid="button-start-shopping">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show latest order details if coming from successful checkout
  if (showSuccess && orders.length > 0) {
    const latestOrder = orders[0];
    const orderItems = JSON.parse(latestOrder.items);

    return (
      <div className="p-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground">Your order has been confirmed</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-order-id">
              Order #{latestOrder.orderId}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-order-date">
              {new Date(latestOrder.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* QR Code for Order */}
          <div className="bg-white p-6 rounded-lg border border-border mb-6 text-center">
            <QRCodePattern orderId={latestOrder.orderId} />
            <p className="text-xs text-muted-foreground mt-3">Show this QR code at store exit</p>
          </div>

          {/* Order Summary */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span className="text-foreground" data-testid="text-order-items">
                {orderItems.length} items
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-semibold text-primary" data-testid="text-order-total">
                ₹{parseFloat(latestOrder.total).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="text-foreground capitalize" data-testid="text-order-payment">
                {latestOrder.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-success capitalize font-medium" data-testid="text-order-status">
                {latestOrder.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              toast({
                title: "Receipt Download",
                description: "Receipt download functionality would be implemented here",
              });
            }}
            data-testid="button-download-receipt"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Link href="/scanner">
            <Button variant="outline" className="w-full" data-testid="button-new-shopping">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Start New Shopping
            </Button>
          </Link>
        </div>

        {/* Store Exit Instructions */}
        <div className="bg-accent/50 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-foreground mb-2">
            <QrCode className="w-4 h-4 inline text-primary mr-2" />
            Exit Instructions
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Show the QR code to security at store exit</li>
            <li>• Keep your receipt for returns/exchanges</li>
            <li>• Thank you for using Smart Checkout!</li>
          </ul>
        </div>

        {/* View All Orders */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => setShowSuccess(false)}
            data-testid="button-view-all-orders"
          >
            View All Orders
          </Button>
        </div>
      </div>
    );
  }

  // Show all orders list
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-foreground mb-6">Your Orders</h2>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const orderItems = JSON.parse(order.items);
          
          return (
            <div key={order.id} className="bg-card rounded-lg border border-border p-4" data-testid={`order-${order.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground" data-testid={`text-order-id-${order.id}`}>
                    Order #{order.orderId}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className="text-success text-sm font-medium capitalize" data-testid={`text-order-status-${order.id}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="text-foreground">{orderItems.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-primary">
                    ₹{parseFloat(order.total).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment:</span>
                  <span className="text-foreground capitalize">{order.paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Receipt Download",
                      description: "Receipt download functionality would be implemented here",
                    });
                  }}
                  data-testid={`button-download-${order.id}`}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
