import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BarcodeScanner from "@/components/barcode-scanner";
import ProductCard from "@/components/product-card";
import { type Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Scanner() {
  const [currentBarcode, setCurrentBarcode] = useState<string | null>(null);

  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/product", currentBarcode],
    enabled: !!currentBarcode,
    retry: false,
  });

  const handleBarcodeScanned = (barcode: string) => {
    setCurrentBarcode(barcode);
  };

  const handleScanAnother = () => {
    setCurrentBarcode(null);
  };

  if (currentBarcode && isLoading) {
    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Looking up product...</h2>
          <p className="text-muted-foreground text-sm">Barcode: {currentBarcode}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <Skeleton className="w-full h-48 mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (currentBarcode && error) {
    return (
      <div className="p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Product not found for barcode: {currentBarcode}
          </AlertDescription>
        </Alert>
        <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
      </div>
    );
  }

  if (currentBarcode && product && typeof product === 'object' && 'id' in product) {
    return <ProductCard product={product} onScanAnother={handleScanAnother} />;
  }

  return <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />;
}
