import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";

export default function AppHeader() {
  const { itemCount } = useCart();

  return (
    <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className="fas fa-shopping-cart text-primary text-xl"></i>
          <h1 className="text-lg font-semibold text-foreground">Smart Checkout</h1>
        </div>
        <div className="relative">
          <Link href="/cart">
            <button 
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center cart-badge"
                  data-testid="text-cart-count"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
