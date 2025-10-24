import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart, QrCode } from "lucide-react";
import { type Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
  onScanAnother: () => void;
}

export default function ProductCard({ product, onScanAnother }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isAddingToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity });
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const discountPercentage = product.mrp && product.discount
    ? Math.round((parseFloat(product.discount) / parseFloat(product.mrp)) * 100)
    : 0;

  return (
    <div className="p-4">
      <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
        {/* Product Image */}
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
            data-testid="img-product"
          />
        )}
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-product-name">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-3" data-testid="text-product-description">
              {product.description}
            </p>
          )}
          
          {/* Pricing */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">MRP:</span>
              <span className="text-sm line-through text-muted-foreground" data-testid="text-product-mrp">
                ₹{parseFloat(product.mrp).toLocaleString()}
              </span>
            </div>
            {parseFloat(product.discount || "0") > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-warning font-medium">
                  <i className="fas fa-tag mr-1"></i>Discount:
                </span>
                <span className="text-sm font-medium text-warning" data-testid="text-product-discount">
                  -₹{parseFloat(product.discount || "0").toLocaleString()} ({discountPercentage}%)
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-foreground">Final Price:</span>
              <span className="text-primary" data-testid="text-product-price">
                ₹{parseFloat(product.finalPrice).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">Quantity:</span>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full p-0"
                data-testid="button-decrease-quantity"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center font-medium" data-testid="text-quantity">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseQuantity}
                className="w-8 h-8 rounded-full p-0"
                data-testid="button-increase-quantity"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1"
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              onClick={onScanAnother}
              variant="outline"
              size="sm"
              className="px-4"
              data-testid="button-scan-another"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
