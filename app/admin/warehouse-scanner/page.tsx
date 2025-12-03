'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';

interface ScannedItem {
  id: string;
  skuCode: string;
  name: string;
  price: number;
  quantity: number;
}

interface ScanSession {
  id: string;
  status: string;
  totalPrice: number;
  itemCount: number;
  items: any[];
}

export default function WarehouseScannerPage() {
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastScanned, setLastScanned] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [manualSkuInput, setManualSkuInput] = useState<string>('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [customerData, setCustomerData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    country: 'CZ',
    deliveryMethod: 'standard',
    paymentMethod: 'bank_transfer',
  });

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const response = await fetch('/api/admin/scan-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      const data = await response.json();
      setSessionId(data.session.id);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Chyba při vytváření relace: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Initialize camera
  useEffect(() => {
    if (!isScanning || !sessionId) return;

    const initCamera = async () => {
      try {
        qrCodeRef.current = new Html5Qrcode('qr-reader');

        const onSuccess: QrcodeSuccessCallback = (decodedText) => {
          // Prevent duplicate scans within 1 second
          if (lastScanned === decodedText) return;
          setLastScanned(decodedText);

          // Process the scanned SKU code
          processScannedSKU(decodedText);

          // Reset last scanned after 2 seconds
          setTimeout(() => setLastScanned(''), 2000);
        };

        const onError: QrcodeErrorCallback = () => {
          // Silently ignore errors (no camera frame)
        };

        await qrCodeRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            disableFlip: false,
          },
          onSuccess,
          onError
        );

        setCameraReady(true);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Chyba při spuštění kamery: ' + (error instanceof Error ? error.message : String(error)));
        setIsScanning(false);
      }
    };

    initCamera();

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().catch(() => {});
      }
      setCameraReady(false);
    };
  }, [isScanning, sessionId, lastScanned]);

  const processScannedSKU = async (skuCode: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Lookup SKU
      const response = await fetch(`/api/admin/scan-sku?sku=${encodeURIComponent(skuCode)}`);

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage('SKU nenalezen: ' + skuCode);
        setIsProcessing(false);
        return;
      }

      const { sku } = await response.json();

      // Add item to session
      const sessionResponse = await fetch('/api/admin/scan-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addItem',
          sessionId,
          skuId: sku.id,
          skuName: sku.name,
          price: sku.priceCzkTotal || sku.pricePerGramCzk * (sku.weightTotalG || 100),
          quantity: 1,
        }),
      });

      if (!sessionResponse.ok) {
        const data = await sessionResponse.json();
        throw new Error(data.error);
      }

      const sessionData = await sessionResponse.json();

      // Update UI
      const newItem: ScannedItem = {
        id: sku.id,
        skuCode: sku.skuCode,
        name: sku.name,
        price: sessionData.scanItem.price,
        quantity: sessionData.scanItem.quantity,
      };

      setScannedItems([...scannedItems, newItem]);
      setTotalPrice(sessionData.session.totalPrice);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Chyba při zpracování SKU: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsProcessing(false);
    }
  };

  const completeSession = async () => {
    if (scannedItems.length === 0) {
      setErrorMessage('Nebyly skenovány žádné položky');
      return;
    }

    try {
      const response = await fetch('/api/admin/scan-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          sessionId,
          status: 'completed',
        }),
      });

      if (!response.ok) throw new Error('Failed to complete session');

      // Show order form instead of resetting
      setShowOrderForm(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Chyba při dokončení relace: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);

    try {
      const response = await fetch('/api/admin/scan-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...customerData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const data = await response.json();
      setErrorMessage(`Objednávka vytvořena! ID: ${data.order.id}`);

      // Reset for next session
      setTimeout(() => {
        setScannedItems([]);
        setTotalPrice(0);
        setSessionId('');
        setIsScanning(false);
        setShowOrderForm(false);
        setErrorMessage('');
        setCustomerData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          streetAddress: '',
          city: '',
          zipCode: '',
          country: 'CZ',
          deliveryMethod: 'standard',
          paymentMethod: 'bank_transfer',
        });
        initializeSession();
      }, 2000);
    } catch (error) {
      setErrorMessage('Chyba při vytváření objednávky: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const resetSession = async () => {
    setScannedItems([]);
    setTotalPrice(0);
    setSessionId('');
    setIsScanning(false);
    setErrorMessage('');
    initializeSession();
  };

  const handleManualSkuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualSkuInput.trim()) {
      setErrorMessage('Zadejte SKU kód');
      return;
    }

    // Process the manually entered SKU code
    await processScannedSKU(manualSkuInput.trim());
    setManualSkuInput(''); // Clear input after processing
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Skladová skener</h1>
          <p className="text-gray-400">Naskenujte QR kódy produktů a vytvořte objednávky</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
              {/* Camera Controls */}
              <div className="bg-gray-700 p-4 border-b border-gray-600 space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsScanning(!isScanning)}
                    className={`px-6 py-2 rounded font-medium transition ${
                      isScanning
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isScanning ? '⏹ Zastavit skenování' : '▶ Spustit skenování'}
                  </button>
                  <button
                    onClick={resetSession}
                    className="px-6 py-2 rounded font-medium bg-gray-600 hover:bg-gray-500 transition"
                  >
                    ↻ Nová relace
                  </button>
                </div>

                {/* Manual SKU Input */}
                <form onSubmit={handleManualSkuSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={manualSkuInput}
                    onChange={(e) => setManualSkuInput(e.target.value)}
                    placeholder="Zadejte SKU kód ručně..."
                    className="flex-1 px-4 py-2 rounded bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 rounded font-medium bg-blue-600 hover:bg-blue-700 transition"
                  >
                    ✓ Přidat
                  </button>
                </form>
              </div>

              {/* Camera Display */}
              <div className="bg-black aspect-video flex items-center justify-center relative">
                {isScanning ? (
                  <div id="qr-reader" style={{ width: '100%' }} />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 text-lg">Kamera je vypnutá</p>
                    <p className="text-gray-600 text-sm mt-2">Klikněte na tlačítko výše pro spuštění</p>
                  </div>
                )}
              </div>

              {/* Session Info */}
              <div className="bg-gray-700 p-4 border-t border-gray-600">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Relace ID</p>
                    <p className="font-mono text-xs text-gray-300 break-all">{sessionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Stav</p>
                    <p className="text-blue-400">{isScanning ? '🟢 Aktivní' : '⚫ Vypnuto'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items List & Summary */}
          <div className="flex flex-col gap-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-4">Shrnutí</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Počet položek:</span>
                  <span className="font-bold text-2xl">{scannedItems.length}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-300">Celková cena:</span>
                  <span className="font-bold text-2xl text-green-400">{(totalPrice / 100).toFixed(2)} Kč</span>
                </div>
              </div>

              <button
                onClick={completeSession}
                disabled={scannedItems.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-3 rounded transition"
              >
                ✓ Dokončit a vytvořit objednávku
              </button>
            </div>

            {/* Items List */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl flex-1 flex flex-col">
              <div className="bg-gray-700 p-4 border-b border-gray-600">
                <h3 className="font-semibold">Naskenované položky</h3>
              </div>

              <div className="overflow-y-auto flex-1">
                {scannedItems.length > 0 ? (
                  <div className="divide-y divide-gray-700">
                    {scannedItems.map((item, idx) => (
                      <div key={idx} className="p-4 hover:bg-gray-700 transition">
                        <p className="font-mono text-xs text-gray-400 mb-1">{item.skuCode}</p>
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                          <span>Cena: {(item.price / 100).toFixed(2)} Kč</span>
                          <span>Ks: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
                    <p>Žádné naskenované položky</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Vytvořit objednávku</h2>

              <form onSubmit={submitOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={customerData.email}
                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Jméno"
                    required
                    value={customerData.firstName}
                    onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})}
                    className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Příjmení"
                    required
                    value={customerData.lastName}
                    onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})}
                    className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon (volitelné)"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ulice a číslo"
                    required
                    value={customerData.streetAddress}
                    onChange={(e) => setCustomerData({...customerData, streetAddress: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Město"
                      required
                      value={customerData.city}
                      onChange={(e) => setCustomerData({...customerData, city: e.target.value})}
                      className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="PSČ"
                      required
                      value={customerData.zipCode}
                      onChange={(e) => setCustomerData({...customerData, zipCode: e.target.value})}
                      className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Země"
                      required
                      value={customerData.country}
                      onChange={(e) => setCustomerData({...customerData, country: e.target.value})}
                      className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={customerData.deliveryMethod}
                    onChange={(e) => setCustomerData({...customerData, deliveryMethod: e.target.value})}
                    className="px-4 py-2 rounded bg-gray-700 text-white"
                  >
                    <option value="standard">Standardní doručení</option>
                    <option value="express">Expres doručení</option>
                  </select>
                  <select
                    value={customerData.paymentMethod}
                    onChange={(e) => setCustomerData({...customerData, paymentMethod: e.target.value})}
                    className="px-4 py-2 rounded bg-gray-700 text-white"
                  >
                    <option value="bank_transfer">Bankovní převod</option>
                    <option value="gopay">GoPay</option>
                    <option value="cash">Hotovost</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-bold transition"
                  >
                    {isSubmittingOrder ? 'Vytváření...' : '✓ Vytvořit objednávku'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded font-bold transition"
                  >
                    ✕ Zrušit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className={`mt-6 p-4 rounded ${
            errorMessage.includes('Chyba') ? 'bg-red-900 border border-red-700' : 'bg-blue-900 border border-blue-700'
          }`}>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
