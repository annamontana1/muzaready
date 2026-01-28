"use client";

import { useState, useEffect } from "react";

type Campaign = {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number; // v haléřích
  conversions: number;
  conversionValue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
};

type AdSet = {
  adsetId: string;
  adsetName: string;
  campaignId: string;
  campaignName: string;
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

export default function MetaAdsPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "adsets">("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adsets, setAdsets] = useState<AdSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [activeTab, days]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "campaigns") {
        const res = await fetch(`/api/admin/marketing/campaigns?platform=meta&days=${days}`);
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
        }
      } else if (activeTab === "adsets") {
        const res = await fetch(`/api/admin/marketing/adsets?platform=meta&days=${days}`);
        if (res.ok) {
          const data = await res.json();
          setAdsets(data.adsets || []);
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
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
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 border-b border-stone-200">
          {["campaigns", "adsets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-3 border-b-2 transition-all font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-[#722F37] text-[#722F37] bg-[#722F37]/5"
                  : "border-transparent text-stone-500"
              }`}
            >
              {tab === "campaigns" ? "Kampaně" : "Ad Sets"}
            </button>
          ))}
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
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#722F37] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-500">Načítám data...</p>
        </div>
      )}

      {/* No Data State */}
      {!loading && ((activeTab === "campaigns" && campaigns.length === 0) || (activeTab === "adsets" && adsets.length === 0)) && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-stone-800 mb-2">Žádná data</h3>
          <p className="text-stone-600 mb-4">
            Meta Ads data ještě nebyla synchronizována.
          </p>
          <p className="text-sm text-stone-500">
            Připoj Meta Ads v Settings a spusť synchronizaci.
          </p>
        </div>
      )}

      {/* Campaigns Table */}
      {!loading && activeTab === "campaigns" && campaigns.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Kampaň
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Imprese
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Kliky
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    CTR
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Spend
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Conv.
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    CPA
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    ROAS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign.campaignId}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-800">
                        {campaign.campaignName}
                      </div>
                      <div className="text-xs text-stone-500">
                        ID: {campaign.campaignId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {formatNumber(campaign.impressions)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {formatNumber(campaign.clicks)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {campaign.ctr.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-stone-800">
                      {formatCurrency(campaign.spend)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {campaign.conversions}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {formatCurrency(campaign.cpa)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <span
                        className={`font-semibold ${
                          campaign.roas >= 2
                            ? "text-green-600"
                            : campaign.roas >= 1
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {campaign.roas.toFixed(2)}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ad Sets Table */}
      {!loading && activeTab === "adsets" && adsets.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Ad Set
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Kampaň
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Imprese
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Kliky
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Spend
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    Conv.
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    CPA
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                    ROAS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {adsets.map((adset) => (
                  <tr
                    key={adset.adsetId}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-800">
                        {adset.adsetName}
                      </div>
                      <div className="text-xs text-stone-500">
                        ID: {adset.adsetId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">
                      {adset.campaignName}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {formatNumber(adset.impressions)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {formatNumber(adset.clicks)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-stone-800">
                      {formatCurrency(adset.spend)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {adset.conversions}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-700">
                      {formatCurrency(adset.cpa)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <span
                        className={`font-semibold ${
                          adset.roas >= 2
                            ? "text-green-600"
                            : adset.roas >= 1
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {adset.roas.toFixed(2)}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
