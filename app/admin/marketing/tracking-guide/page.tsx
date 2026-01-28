"use client";

export default function TrackingGuidePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-800 mb-2">
          📊 Návod: Správné nastavení ROAS trackingu
        </h2>
        <p className="text-stone-500">
          Kompletní průvodce pro přesné měření výkonnosti Meta Ads kampaní
        </p>
      </div>

      {/* Problem explanation */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-amber-900 mb-2">
              Proč je důležité rozlišovat nové vs. opakované zákazníky?
            </h3>
            <p className="text-amber-800 text-sm mb-2">
              Představ si: Salon Kadeřnictví Praha klikne na Instagram reklamu a
              poprvé si objedná vlasy za 25,000 Kč. Za měsíc si objedná znovu 20,000 Kč
              - tentokrát PŘÍMO (bez reklamy, protože už vás zná).
            </p>
            <p className="text-amber-800 text-sm font-semibold">
              Pokud bys počítal obě objednávky do ROAS, čísla by byla zkreslená!
            </p>
            <div className="mt-3 bg-white rounded-lg p-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-red-700 mb-1">❌ ŠPATNĚ (bez is_new_customer)</div>
                  <div className="text-stone-700">Spend: 5,000 Kč</div>
                  <div className="text-stone-700">Obrat: 45,000 Kč (obě objednávky)</div>
                  <div className="text-red-700 font-bold">ROAS: 9.0x (zkreslené!)</div>
                </div>
                <div>
                  <div className="font-semibold text-green-700 mb-1">✅ SPRÁVNĚ (s is_new_customer)</div>
                  <div className="text-stone-700">Spend: 5,000 Kč</div>
                  <div className="text-stone-700">Obrat: 25,000 Kč (jen první)</div>
                  <div className="text-green-700 font-bold">ROAS: 5.0x (přesné!)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">
          🔧 Jak funguje tracking v Muzahair?
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-stone-800 mb-1">
                Meta Pixel (Client-Side Tracking)
              </h4>
              <p className="text-sm text-stone-600 mb-2">
                Meta Pixel je už nainstalovaný na webu. Automaticky trackuje:
              </p>
              <ul className="text-sm text-stone-600 space-y-1 ml-4 list-disc">
                <li><code className="bg-stone-100 px-1 rounded">PageView</code> - zobrazení stránek</li>
                <li><code className="bg-stone-100 px-1 rounded">ViewContent</code> - prohlížení produktů</li>
                <li><code className="bg-stone-100 px-1 rounded">AddToCart</code> - přidání do košíku</li>
                <li><code className="bg-stone-100 px-1 rounded">InitiateCheckout</code> - začátek pokladny</li>
                <li><code className="bg-stone-100 px-1 rounded">Purchase</code> - dokončená objednávka</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-stone-800 mb-1">
                Conversions API (Server-Side Tracking)
              </h4>
              <p className="text-sm text-stone-600 mb-2">
                Po úspěšné platbě (GoPay callback) automaticky posíláme data přímo z
                serveru do Meta. To funguje i když má zákazník AdBlocker.
              </p>
              <div className="bg-green-50 border border-green-200 rounded p-3 text-xs text-green-800">
                ✅ Už je nastaveno! Děje se automaticky v <code>/app/api/gopay/notify/route.ts</code>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-stone-800 mb-1">
                is_new_customer Flag (Klíčové!)
              </h4>
              <p className="text-sm text-stone-600 mb-2">
                Systém automaticky detekuje jestli je to první objednávka zákazníka:
              </p>
              <div className="bg-stone-50 border border-stone-200 rounded p-3 text-xs">
                <pre className="text-stone-700 overflow-x-auto">
{`// API endpoint: /api/customer/is-new?email=...
// Kontroluje: Existuje předchozí PAID objednávka?

if (previousOrders) {
  is_new_customer: false  // Opakovaný zákazník
} else {
  is_new_customer: true   // Nový zákazník ✅
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Setup checklist */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">
          ✅ Checklist: Co je potřeba nastavit
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <input type="checkbox" checked disabled className="mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-green-900 text-sm">
                Meta Pixel ID
              </div>
              <div className="text-xs text-green-700">
                Přidej do Vercel Environment Variables: <code className="bg-white px-1 rounded">NEXT_PUBLIC_META_PIXEL_ID</code>
              </div>
              <div className="text-xs text-green-600 mt-1">
                👉 Najdeš v Meta Events Manager → Data Sources → tvůj pixel
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <input type="checkbox" checked disabled className="mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-green-900 text-sm">
                Conversions API Access Token
              </div>
              <div className="text-xs text-green-700">
                Přidej do Vercel Environment Variables: <code className="bg-white px-1 rounded">META_CONVERSIONS_API_TOKEN</code>
              </div>
              <div className="text-xs text-green-600 mt-1">
                👉 Meta Events Manager → Settings → Conversions API → Generate Access Token
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <input type="checkbox" className="mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-amber-900 text-sm">
                Verifikuj tracking v Meta Events Manager
              </div>
              <div className="text-xs text-amber-700">
                Udělej testovací objednávku a zkontroluj, že se event <code className="bg-white px-1 rounded">Purchase</code> objevil s parametrem <code className="bg-white px-1 rounded">is_new_customer: true</code>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <input type="checkbox" className="mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-amber-900 text-sm">
                Nastav Custom Conversion v Meta Ads
              </div>
              <div className="text-xs text-amber-700 mb-2">
                Pro přesný ROAS používej POUZE nové zákazníky:
              </div>
              <ol className="text-xs text-amber-700 space-y-1 ml-4 list-decimal">
                <li>Ads Manager → Custom Conversions → Create</li>
                <li>Event: Purchase</li>
                <li>Filtr: <code className="bg-white px-1 rounded">is_new_customer equals true</code></li>
                <li>Název: "New Customer Purchase"</li>
                <li>V kampani používej tuto custom conversion pro optimalizaci</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced: Attribution windows */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">
          🎯 Advanced: Attribution Windows
        </h3>
        <p className="text-sm text-stone-600 mb-3">
          Meta připisuje konverzi kampani podle toho, kdy zákazník kliknul nebo viděl reklamu:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <strong>1-day click</strong> - Klikl na reklamu a koupil do 24 hodin
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <strong>7-day click</strong> - Klikl na reklamu a koupil do 7 dní (default)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div>
              <strong>1-day view</strong> - Viděl reklamu (nemusel kliknout) a koupil do 24 hodin
            </div>
          </div>
        </div>
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
          💡 Pro B2B (salony) doporučuji <strong>7-day click</strong> - salony často zvažují déle než běžní zákazníci.
        </div>
      </div>

      {/* Current config */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">
          ⚙️ Aktuální konfigurace
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-600">Meta Pixel ID:</span>
            <code className="bg-white px-2 py-1 rounded text-xs">
              {process.env.NEXT_PUBLIC_META_PIXEL_ID || '❌ Nenastaveno'}
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">Conversions API Token:</span>
            <code className="bg-white px-2 py-1 rounded text-xs">
              {process.env.META_CONVERSIONS_API_TOKEN ? '✅ Nastaveno' : '❌ Nenastaveno'}
            </code>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">Tracking metoda:</span>
            <span className="text-stone-800 font-medium">Pixel + Conversions API (dual)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">New customer detection:</span>
            <span className="text-green-700 font-medium">✅ Aktivní</span>
          </div>
        </div>
      </div>
    </div>
  );
}
