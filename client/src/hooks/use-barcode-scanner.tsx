import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useBarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Note: In a real implementation, you would use a barcode scanning library
      // like ZXing-js or QuaggaJS here. For this demo, we'll simulate barcode detection
      simulateBarcodeDetection();

    } catch (err: any) {
      setError("Camera access denied or not available");
      setIsScanning(false);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const simulateBarcodeDetection = () => {
    // Simulate barcode detection after 3 seconds
    setTimeout(() => {
      if (isScanning) {
        // Use one of our sample product barcodes
        const sampleBarcodes = ["8901030890875", "8901030890876", "8901030890877"];
        const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
        setScannedCode(randomBarcode);
        stopScanning();
      }
    }, 3000);
  };

  const resetScanner = () => {
    setScannedCode(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return {
    isScanning,
    scannedCode,
    error,
    videoRef,
    startScanning,
    stopScanning,
    resetScanner,
  };
}
