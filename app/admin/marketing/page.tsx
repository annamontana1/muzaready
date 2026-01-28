"use client";

import { useState, useEffect } from "react";

type PlatformMetrics = {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
};

export default function MarketingOverviewPage() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState<PlatformMetrics | null>(null);
  const [metaPlatform, setMetaPlatform] = useState<PlatformMetrics | null>(null);
  const [googlePlatform, setGooglePlatform] = useState<PlatformMetrics | null>(null);

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all platforms
      const resAll = await fetch(`/api/admin/marketing/metrics?platform=all&level=campaign&days=${days}`);
      if (resAll.ok) {
        const data = await resAll.json();
        setTotals(data.totals);
      }

      // Fetch Meta
      const resMeta = await fetch(`/api/admin/marketing/metrics?platform=meta&level=campaign&days=${days}`);
      if (resMeta.ok) {
        const data = await resMeta.json();
        setMetaPlatform(data.totals);
      }

      // Fetch Google
      const resGoogle = await fetch(`/api/admin/marketing/metrics?platform=google&level=campaign&days=${days}`);
      if (resGoogle.ok) {
        const data = await resGoogle.json();
        setGooglePlatform(data.totals);
      }
    } catch (error) {
      console.error("Failed to load overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("cs-CZ").format(num);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Overview Dashboard</h2>
          <p className="text-stone-500">
            Přehled výkonu všech marketingových kanálů
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700"
        >
          <option value={7}>Posledních 7 dní</option>
          <option value={30}>Posledních 30 dní</option>
          <option value={90}>Posledních 90 dní</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center mb-6">
          <div className="animate-spin w-8 h-8 border-4 border-[#722F37] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-500">Načítám data...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="text-sm font-medium text-stone-500 mb-1">Celková útrata</div>
              <div className="text-3xl font-bold text-stone-800">
                {totals ? formatCurrency(totals.spend) : "0 Kč"}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {totals ? `${formatNumber(totals.impressions)} impresí` : "Žádná data"}
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="text-sm font-medium text-stone-500 mb-1">Celkové kliky</div>
              <div className="text-3xl font-bold text-stone-800">
                {totals ? formatNumber(totals.clicks) : "0"}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {totals ? `CTR ${totals.ctr.toFixed(2)}%` : "Žádná data"}
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="text-sm font-medium text-stone-500 mb-1">Konverze</div>
              <div className="text-3xl font-bold text-stone-800">
                {totals ? formatNumber(totals.conversions) : "0"}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {totals && totals.conversions > 0
                  ? `CPA ${formatCurrency(totals.cpa)}`
                  : "Žádné konverze"}
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="text-sm font-medium text-stone-500 mb-1">ROAS</div>
              <div className={`text-3xl font-bold ${
                totals && totals.roas >= 2
                  ? "text-green-600"
                  : totals && totals.roas >= 1
                  ? "text-yellow-600"
                  : "text-stone-800"
              }`}>
                {totals ? `${totals.roas.toFixed(2)}x` : "0x"}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {totals ? formatCurrency(totals.conversionValue) : "0 Kč"} obrat
              </div>
            </div>
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Google Ads */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-stone-800">Google Ads</h3>
              </div>
              {!googlePlatform || googlePlatform.spend === 0 ? (
                <div className="text-stone-500 text-sm">
                  Připoj Google Ads účet v Settings
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">Spend:</span>
                    <span className="font-semibold text-stone-800">
                      {formatCurrency(googlePlatform.spend)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">Kliky:</span>
                    <span className="font-semibold text-stone-800">
                      {formatNumber(googlePlatform.clicks)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">ROAS:</span>
                    <span className={`font-semibold ${
                      googlePlatform.roas >= 2
                        ? "text-green-600"
                        : googlePlatform.roas >= 1
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                      {googlePlatform.roas.toFixed(2)}x
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Meta Ads */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📘</span>
                </div>
                <h3 className="text-lg font-semibold text-stone-800">Meta Ads</h3>
              </div>
              {!metaPlatform || metaPlatform.spend === 0 ? (
                <div className="text-stone-500 text-sm">Připoj Meta Ads účet v Settings</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">Spend:</span>
                    <span className="font-semibold text-stone-800">
                      {formatCurrency(metaPlatform.spend)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">Kliky:</span>
                    <span className="font-semibold text-stone-800">
                      {formatNumber(metaPlatform.clicks)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-600">ROAS:</span>
                    <span className={`font-semibold ${
                      metaPlatform.roas >= 2
                        ? "text-green-600"
                        : metaPlatform.roas >= 1
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                      {metaPlatform.roas.toFixed(2)}x
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-semibold text-stone-800">AI Doporučení</h3>
            </div>
            <div className="text-stone-600">
              {!totals || totals.spend === 0
                ? "Žádná doporučení. Nejprve připoj marketingové platformy."
                : "AI analýza bude dostupná po implementaci Claude API integrace."}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
