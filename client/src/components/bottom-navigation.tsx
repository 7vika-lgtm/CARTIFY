import { QrCode, ShoppingCart, Receipt, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { itemCount } = useCart();

  const isActive = (path: string) => {
    if (path === "/" && (location === "/" || location === "/scanner")) return true;
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border">
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        <Link href="/scanner">
          <button 
            className={`flex flex-col items-center py-2 px-1 transition-colors ${
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="button-nav-scan"
          >
            <QrCode className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Scan</span>
          </button>
        </Link>
        
        <Link href="/cart">
          <button 
            className={`flex flex-col items-center py-2 px-1 transition-colors ${
              isActive("/cart") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="button-nav-cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 mb-1" />
              {itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  data-testid="text-nav-cart-count"
                >
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs">Cart</span>
          </button>
        </Link>
        
        <Link href="/orders">
          <button 
            className={`flex flex-col items-center py-2 px-1 transition-colors ${
              isActive("/orders") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="button-nav-orders"
          >
            <Receipt className="w-5 h-5 mb-1" />
            <span className="text-xs">Orders</span>
          </button>
        </Link>
        
        <button 
          className="flex flex-col items-center py-2 px-1 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-nav-profile"
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
