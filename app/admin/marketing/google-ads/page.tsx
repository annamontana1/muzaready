export default function GoogleAdsPage() {
  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-stone-200 mb-6">
        {["Campaigns", "Keywords", "Search Terms"].map((tab, idx) => (
          <button
            key={tab}
            className={`px-5 py-3 border-b-2 transition-all font-medium text-sm ${
              idx === 0
                ? "border-[#722F37] text-[#722F37] bg-[#722F37]/5"
                : "border-transparent text-stone-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-bold text-stone-800 mb-2">Google Ads integrace</h3>
        <p className="text-stone-600 mb-4">
          Bude implementována ve Fázi 2
        </p>
        <p className="text-sm text-stone-500">
          Nejprve připoj Google Ads účet v Settings
        </p>
      </div>
    </div>
  );
}
