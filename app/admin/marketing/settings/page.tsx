"use client";

import { useState, useEffect } from "react";

type ConnectionStatus = {
  platform: string;
  connected: boolean;
  accountName?: string;
  lastSync?: string;
  error?: string;
};

type MarketingConfig = {
  averageOrderValue: number; // v Kč
  grossMarginPercent: number;
  targetRoas?: number;
  targetCpa?: number; // v Kč
  monthlyBudget?: number; // v Kč
  breakEvenRoas?: number;
  maxCpa?: number; // v Kč
};

export default function MarketingSettingsPage() {
  const [activeTab, setActiveTab] = useState<"connections" | "config">(
    "connections"
  );
  const [connections, setConnections] = useState<ConnectionStatus[]>([]);
  const [config, setConfig] = useState<MarketingConfig>({
    averageOrderValue: 10000,
    grossMarginPercent: 50,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load config on mount
  useEffect(() => {
    loadConfig();
    loadConnections();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/admin/marketing/config");
      if (res.ok) {
        const data = await res.json();
        setConfig({
          averageOrderValue: data.averageOrderValue / 100, // z haléřů na Kč
          grossMarginPercent: data.grossMarginPercent,
          targetRoas: data.targetRoas,
          targetCpa: data.targetCpa ? data.targetCpa / 100 : undefined,
          monthlyBudget: data.monthlyBudget
            ? data.monthlyBudget / 100
            : undefined,
          breakEvenRoas: data.breakEvenRoas,
          maxCpa: data.maxCpa ? data.maxCpa / 100 : undefined,
        });
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  const loadConnections = async () => {
    try {
      // Load Meta Ads connection
      const metaRes = await fetch("/api/admin/marketing/connections/meta");
      const metaData = metaRes.ok ? await metaRes.json() : { connected: false };

      setConnections([
        {
          platform: "Google Ads",
          connected: false,
        },
        {
          platform: "Meta Ads",
          connected: metaData.connected,
          accountName: metaData.accountName,
          lastSync: metaData.lastSync,
          error: metaData.error,
        },
        {
          platform: "GA4",
          connected: false,
        },
        {
          platform: "GSC",
          connected: false,
        },
      ]);
    } catch (error) {
      console.error("Failed to load connections:", error);
    }
  };

  const handleConnect = (platform: string) => {
    if (platform === "Meta Ads") {
      const accessToken = prompt("Zadej Meta Ads Access Token:");
      const adAccountId = prompt("Zadej Ad Account ID (např. act_123456789):");

      if (accessToken && adAccountId) {
        connectMetaAds(accessToken, adAccountId);
      }
    } else {
      alert(`${platform} integrace bude přidána později`);
    }
  };

  const connectMetaAds = async (accessToken: string, adAccountId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marketing/connections/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, adAccountId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.message);
        loadConnections();
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      alert("Chyba při připojování");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (platform: string) => {
    if (platform === "Meta Ads") {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/marketing/connections/meta/test", {
          method: "POST",
        });

        const data = await res.json();

        if (res.ok) {
          alert(`✅ ${data.message}\n\nAccount: ${data.account.name}\nID: ${data.account.id}\nStatus: ${data.account.status}`);
          loadConnections();
        } else {
          alert("❌ " + data.error);
        }
      } catch (error) {
        alert("Chyba při testování");
      } finally {
        setLoading(false);
      }
    } else {
      alert(`${platform} test není dostupný`);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Opravdu chceš odpojit ${platform}?`)) return;

    if (platform === "Meta Ads") {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/marketing/connections/meta", {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok) {
          alert("✅ " + data.message);
          loadConnections();
        } else {
          alert("❌ " + data.error);
        }
      } catch (error) {
        alert("Chyba při odpojování");
      } finally {
        setLoading(false);
      }
    } else {
      alert(`${platform} disconnect není dostupný`);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/marketing/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          averageOrderValue: config.averageOrderValue * 100, // na haléře
          grossMarginPercent: config.grossMarginPercent,
          targetRoas: config.targetRoas,
          targetCpa: config.targetCpa ? config.targetCpa * 100 : undefined,
          monthlyBudget: config.monthlyBudget
            ? config.monthlyBudget * 100
            : undefined,
        }),
      });

      if (res.ok) {
        alert("Nastavení uloženo!");
        loadConfig(); // Reload to get auto-calculated values
      } else {
        alert("Chyba při ukládání");
      }
    } catch (error) {
      alert("Chyba při ukládání");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Tracking Guide Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📚</span>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Důležité: Jak správně měřit ROAS
            </h3>
            <p className="text-sm text-blue-800 mb-2">
              Pro přesné měření výkonnosti kampaní je důležité rozlišovat nové vs. opakované zákazníky.
              Návod najdeš v sekci <strong>Tracking Guide</strong>.
            </p>
            <a
              href="/admin/marketing/tracking-guide"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              📚 Přečíst návod
            </a>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-stone-200 mb-6">
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-5 py-3 border-b-2 transition-all font-medium text-sm ${
            activeTab === "connections"
              ? "border-[#722F37] text-[#722F37] bg-[#722F37]/5"
              : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
          }`}
        >
          API Connections
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`px-5 py-3 border-b-2 transition-all font-medium text-sm ${
            activeTab === "config"
              ? "border-[#722F37] text-[#722F37] bg-[#722F37]/5"
              : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
          }`}
        >
          Project Config
        </button>
      </div>

      {/* API Connections Tab */}
      {activeTab === "connections" && (
        <div className="space-y-3">
          {connections.map((conn) => (
            <div
              key={conn.platform}
              className="bg-white border border-stone-200 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">
                  {conn.connected ? "✅" : "❌"}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">{conn.platform}</h3>
                  {conn.connected && conn.accountName && (
                    <p className="text-sm text-stone-500">{conn.accountName}</p>
                  )}
                  {conn.error && (
                    <p className="text-sm text-red-500">{conn.error}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {conn.connected ? (
                  <>
                    <button
                      onClick={() => handleTest(conn.platform)}
                      disabled={loading}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:bg-stone-50 disabled:cursor-not-allowed text-stone-700 rounded-lg transition-colors font-medium text-sm"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => handleDisconnect(conn.platform)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 disabled:bg-stone-50 disabled:cursor-not-allowed text-red-600 rounded-lg transition-colors font-medium text-sm"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(conn.platform)}
                    disabled={loading}
                    className="px-4 py-2 bg-[#722F37] hover:bg-[#5a2529] disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    {loading ? "..." : "Connect"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Config Tab */}
      {activeTab === "config" && (
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-stone-800 mb-2">Business Configuration</h3>
          <p className="text-sm text-stone-500 mb-6">
            Nastav základní byznys metriky pro výpočet ROAS, CPA a doporučení
            od AI.
          </p>

          <div className="space-y-8">
            {/* Required Fields */}
            <div>
              <h4 className="font-semibold text-stone-800 mb-4 text-sm uppercase tracking-wide">Základní údaje (povinné)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Průměrná hodnota objednávky (AOV)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.averageOrderValue}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          averageOrderValue: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10 text-stone-800"
                    />
                    <span className="text-stone-500 font-medium">Kč</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Hrubá marže
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.grossMarginPercent}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          grossMarginPercent: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10 text-stone-800"
                    />
                    <span className="text-stone-500 font-medium">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div>
              <h4 className="font-semibold text-stone-800 mb-2 text-sm uppercase tracking-wide">
                Cíle a limity (volitelné)
              </h4>
              <p className="text-sm text-stone-500 mb-4">
                Pokud nevyplníš, AI bude doporučovat pouze na základě
                break-even hodnot.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Měsíční budget
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.monthlyBudget || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monthlyBudget: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Neomezený"
                      className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10 text-stone-800 placeholder:text-stone-400"
                    />
                    <span className="text-stone-500 font-medium">Kč</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Target ROAS
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={config.targetRoas || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          targetRoas: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Auto"
                      className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10 text-stone-800 placeholder:text-stone-400"
                    />
                    <span className="text-stone-500 font-medium">x</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Target CPA
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={config.targetCpa || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          targetCpa: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Auto"
                      className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10 text-stone-800 placeholder:text-stone-400"
                    />
                    <span className="text-stone-500 font-medium">Kč</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-calculated */}
            <div className="border-t border-stone-200 pt-6">
              <h4 className="font-semibold text-stone-800 mb-4 text-sm uppercase tracking-wide">Auto-vypočítané hodnoty</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                  <div className="text-sm font-medium text-stone-600 mb-1">
                    Break-even ROAS
                  </div>
                  <div className="text-3xl font-bold text-stone-800 mb-1">
                    {config.breakEvenRoas?.toFixed(2) || "—"}x
                  </div>
                  <div className="text-xs text-stone-500">
                    100 / marže = minimální ROAS pro ziskovost
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <div className="text-sm font-medium text-stone-600 mb-1">
                    Max CPA (break-even)
                  </div>
                  <div className="text-3xl font-bold text-stone-800 mb-1">
                    {config.maxCpa?.toFixed(0) || "—"} Kč
                  </div>
                  <div className="text-xs text-stone-500">
                    AOV × (marže/100) = max náklady na konverzi
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="px-8 py-3 bg-[#722F37] hover:bg-[#5a2529] disabled:bg-stone-300 text-white rounded-lg transition-colors font-medium flex items-center gap-2 shadow-sm hover:shadow"
              >
                {saving && <span className="animate-spin">⏳</span>}
                Uložit konfiguraci
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
