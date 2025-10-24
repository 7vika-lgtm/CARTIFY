import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, CreditCard, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import CartItem from "@/components/cart-item";
import { Link } from "wouter";

export default function Cart() {
  const {
    items,
    summary,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="space-y-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4">
              <div className="flex space-x-3">
                <Skeleton className="w-16 h-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Shopping Cart</h2>
        </div>
        
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">Start scanning products to add them to your cart</p>
          <Link href="/scanner">
            <Button data-testid="button-start-shopping">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Shopping Cart</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => clearCart()}
          disabled={isClearing}
          className="text-destructive hover:text-destructive/80"
          data-testid="button-clear-cart"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {isClearing ? "Clearing..." : "Clear All"}
        </Button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={(id: string, quantity: number) => updateQuantity({ id, quantity })}
            onRemove={removeItem}
            isUpdating={isUpdating || isRemoving}
          />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-card rounded-lg border border-border p-4 mb-6">
        <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({summary.itemCount} items):</span>
            <span className="text-foreground" data-testid="text-cart-subtotal">
              ₹{parseFloat(summary.subtotal.toString()).toLocaleString()}
            </span>
          </div>
          {parseFloat(summary.savings.toString()) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Savings:</span>
              <span className="text-success" data-testid="text-cart-savings">
                -₹{parseFloat(summary.savings.toString()).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (GST):</span>
            <span className="text-foreground" data-testid="text-cart-tax">
              ₹{parseFloat(summary.tax.toString()).toLocaleString()}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-foreground">Total Amount:</span>
            <span className="text-primary" data-testid="text-cart-total">
              ₹{parseFloat(summary.total.toString()).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button className="w-full py-4 text-base font-semibold" data-testid="button-checkout">
          <CreditCard className="w-5 h-5 mr-2" />
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
}
