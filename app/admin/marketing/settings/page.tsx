"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";

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
    // TODO: Implement when API is ready
    setConnections([
      { platform: "Google Ads", connected: false },
      { platform: "Meta Ads", connected: false },
      { platform: "GA4", connected: false },
      { platform: "GSC", connected: false },
    ]);
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
      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "connections"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-slate-400"
          }`}
        >
          API Connections
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "config"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-slate-400"
          }`}
        >
          Project Config
        </button>
      </div>

      {/* API Connections Tab */}
      {activeTab === "connections" && (
        <div className="space-y-4">
          {connections.map((conn) => (
            <div
              key={conn.platform}
              className="bg-slate-800 rounded-lg p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div>
                  {conn.connected ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <X className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{conn.platform}</h3>
                  {conn.connected && conn.accountName && (
                    <p className="text-sm text-slate-400">{conn.accountName}</p>
                  )}
                  {conn.error && (
                    <p className="text-sm text-red-400">{conn.error}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {conn.connected ? (
                  <>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
                      Test
                    </button>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Config Tab */}
      {activeTab === "config" && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Business Configuration</h3>
          <p className="text-sm text-slate-400 mb-6">
            Nastav základní byznys metriky pro výpočet ROAS, CPA a doporučení
            od AI.
          </p>

          <div className="space-y-6">
            {/* Required Fields */}
            <div>
              <h4 className="font-semibold mb-4">Základní údaje (povinné)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
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
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400">Kč</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
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
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div>
              <h4 className="font-semibold mb-4">
                Cíle a limity (volitelné)
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                Pokud nevyplníš, AI bude doporučovat pouze na základě
                break-even hodnot.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
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
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400">Kč</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
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
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400">x</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
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
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400">Kč</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-calculated */}
            <div className="border-t border-slate-700 pt-6">
              <h4 className="font-semibold mb-4">Auto-vypočítané hodnoty</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded p-4">
                  <div className="text-sm text-slate-400 mb-1">
                    Break-even ROAS
                  </div>
                  <div className="text-2xl font-bold">
                    {config.breakEvenRoas?.toFixed(2) || "—"}x
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    100 / marže = minimální ROAS pro ziskovost
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded p-4">
                  <div className="text-sm text-slate-400 mb-1">
                    Max CPA (break-even)
                  </div>
                  <div className="text-2xl font-bold">
                    {config.maxCpa?.toFixed(0) || "—"} Kč
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    AOV × (marže/100) = max náklady na konverzi
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Uložit konfiguraci
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
