export default function GoogleAdsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Google Ads</h2>
        <p className="text-slate-400">
          Správa Google Ads kampaní, keywords a search terms
        </p>
      </div>

      {/* Sub-tabs placeholder */}
      <div className="flex gap-2 border-b border-slate-700 mb-6">
        {["Campaigns", "Keywords", "Search Terms"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 border-b-2 border-transparent text-slate-400"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-lg p-6 text-center">
        <p className="text-slate-400 mb-4">
          Google Ads integrace bude implementována ve Fázi 2
        </p>
        <p className="text-sm text-slate-500">
          Nejprve připoj Google Ads účet v Settings
        </p>
      </div>
    </div>
  );
}
