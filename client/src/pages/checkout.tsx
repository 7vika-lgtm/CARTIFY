import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Lock, Smartphone, CreditCard, Banknote, Tag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Link } from "wouter";

type PaymentMethod = "upi" | "card" | "cash";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const { items, summary, userId } = useCart();
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        userId,
        items: JSON.stringify(items),
        subtotal: summary.subtotal,
        tax: summary.tax,
        total: summary.total,
        savings: summary.savings,
        paymentMethod,
        status: "completed",
      };

      const response = await apiRequest("POST", "/api/checkout", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.orderId} has been confirmed`,
      });
      setLocation(`/orders?orderSuccess=${order.orderId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Checkout Failed",
        description: error.message || "Unable to process your order",
        variant: "destructive",
      });
    },
  });

  if (items.length === 0) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>
            Your cart is empty. Add some items before checkout.
          </AlertDescription>
        </Alert>
        <Link href="/scanner">
          <Button className="mt-4">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="p-2 -ml-2" data-testid="button-back-to-cart">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold text-foreground ml-3">Checkout</h2>
      </div>

      {/* Order Summary Card */}
      <div className="bg-card rounded-lg border border-border p-4 mb-6">
        <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items ({summary.itemCount}):</span>
            <span className="text-foreground" data-testid="text-checkout-subtotal">
              ₹{parseFloat(summary.subtotal.toString()).toLocaleString()}
            </span>
          </div>
          {parseFloat(summary.savings.toString()) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Savings:</span>
              <span className="text-success" data-testid="text-checkout-savings">
                -₹{parseFloat(summary.savings.toString()).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (GST):</span>
            <span className="text-foreground" data-testid="text-checkout-tax">
              ₹{parseFloat(summary.tax.toString()).toLocaleString()}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-foreground">Total:</span>
            <span className="text-primary" data-testid="text-checkout-total">
              ₹{parseFloat(summary.total.toString()).toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Savings Badge */}
        {parseFloat(summary.savings.toString()) > 0 && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <p className="text-success text-sm font-medium">
              <Tag className="w-4 h-4 inline mr-2" />
              You saved ₹{parseFloat(summary.savings.toString()).toLocaleString()} on this order!
            </p>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-card rounded-lg border border-border p-4 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
        
        <div className="space-y-3">
          {/* UPI Payment */}
          <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="text-primary focus:ring-primary"
              data-testid="radio-payment-upi"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 text-primary mr-2" />
                <span className="font-medium text-foreground">UPI Payment</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Pay using your UPI app (GPay, PhonePe, Paytm)
              </p>
            </div>
          </label>

          {/* Card Payment */}
          <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="text-primary focus:ring-primary"
              data-testid="radio-payment-card"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-primary mr-2" />
                <span className="font-medium text-foreground">Card Payment</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Debit/Credit Card or Net Banking
              </p>
            </div>
          </label>

          {/* Cash Payment */}
          <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="text-primary focus:ring-primary"
              data-testid="radio-payment-cash"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <Banknote className="w-5 h-5 text-primary mr-2" />
                <span className="font-medium text-foreground">Pay at Counter</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Complete payment at store counter
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={() => checkoutMutation.mutate()}
        disabled={checkoutMutation.isPending}
        className="w-full py-4 text-base font-semibold"
        data-testid="button-place-order"
      >
        <Lock className="w-5 h-5 mr-2" />
        {checkoutMutation.isPending
          ? "Processing..."
          : `Pay ₹${parseFloat(summary.total.toString()).toLocaleString()} Securely`
        }
      </Button>

      {/* Security Note */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        <Lock className="w-3 h-3 inline mr-1" />
        Your payment information is secure and encrypted
      </p>
    </div>
  );
}
