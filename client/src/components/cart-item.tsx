import { Button } from "@/components/ui/button";
import { Plus, Minus, X } from "lucide-react";
import { type CartItemWithProduct } from "@shared/schema";

interface CartItemProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating?: boolean;
}

export default function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const { product, quantity } = item;
  
  const discountPercentage = product.mrp && product.discount
    ? Math.round((parseFloat(product.discount) / parseFloat(product.mrp)) * 100)
    : 0;

  return (
    <div className="bg-card rounded-lg border border-border p-4" data-testid={`cart-item-${item.id}`}>
      <div className="flex space-x-3">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-md"
            data-testid={`img-cart-item-${item.id}`}
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-foreground text-sm mb-1" data-testid={`text-cart-item-name-${item.id}`}>
            {product.name}
          </h4>
          {parseFloat(product.discount || "0") > 0 && (
            <p className="text-xs text-muted-foreground mb-2" data-testid={`text-cart-item-discount-${item.id}`}>
              {discountPercentage}% off • Save ₹{(parseFloat(product.discount || "0") * quantity).toLocaleString()}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary" data-testid={`text-cart-item-price-${item.id}`}>
              ₹{(parseFloat(product.finalPrice) * quantity).toLocaleString()}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                disabled={isUpdating || quantity <= 1}
                className="w-6 h-6 rounded-full p-0"
                data-testid={`button-decrease-${item.id}`}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-medium w-6 text-center" data-testid={`text-cart-quantity-${item.id}`}>
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                disabled={isUpdating}
                className="w-6 h-6 rounded-full p-0"
                data-testid={`button-increase-${item.id}`}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          disabled={isUpdating}
          className="text-destructive hover:text-destructive/80 p-1"
          data-testid={`button-remove-${item.id}`}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
