import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Camera } from "lucide-react";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export default function BarcodeScanner({ onBarcodeScanned }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState("");
  const { isScanning, scannedCode, error, videoRef, startScanning, stopScanning, resetScanner } = useBarcodeScanner();

  // Handle scanned barcode
  if (scannedCode && !isScanning) {
    onBarcodeScanned(scannedCode);
    resetScanner();
  }

  const handleManualLookup = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Scan Product Barcode</h2>
        <p className="text-muted-foreground text-sm">Point your camera at the product barcode</p>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6" style={{ aspectRatio: "4/3" }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          data-testid="video-camera"
        />
        
        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-40 border-2 border-primary rounded-lg relative pulse-border">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
              
              {/* Scanning Line */}
              <div className="absolute inset-0 scanner-overlay"></div>
            </div>
          </div>
        )}

        {/* Instructions/Error Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          {error ? (
            <p className="text-white text-center text-sm bg-destructive/80 rounded px-3 py-2">
              <i className="fas fa-exclamation-triangle mr-2"></i>{error}
            </p>
          ) : (
            <p className="text-white text-center text-sm bg-black bg-opacity-50 rounded px-3 py-2">
              <Camera className="inline w-4 h-4 mr-2" />
              {isScanning ? "Scanning... Hold steady" : "Tap to start scanning"}
            </p>
          )}
        </div>

        {/* Camera Control */}
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={startScanning}
              size="lg"
              className="rounded-full"
              data-testid="button-start-scan"
            >
              <Camera className="w-6 h-6 mr-2" />
              Start Scanning
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={stopScanning}
              variant="destructive"
              size="sm"
              data-testid="button-stop-scan"
            >
              Stop
            </Button>
          </div>
        )}
      </div>

      {/* Manual Entry Option */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-3">Can't scan? Enter barcode manually:</p>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter barcode number"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualLookup()}
            className="flex-1"
            data-testid="input-barcode"
          />
          <Button
            onClick={handleManualLookup}
            variant="secondary"
            size="sm"
            disabled={!manualBarcode.trim()}
            data-testid="button-lookup-barcode"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
