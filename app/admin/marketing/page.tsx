export default function MarketingOverviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-800 mb-2">Overview Dashboard</h2>
        <p className="text-stone-500">
          Přehled výkonu všech marketingových kanálů
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-sm font-medium text-stone-500 mb-1">Celková útrata</div>
          <div className="text-3xl font-bold text-stone-800">0 Kč</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-sm font-medium text-stone-500 mb-1">Celkové kliky</div>
          <div className="text-3xl font-bold text-stone-800">0</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-sm font-medium text-stone-500 mb-1">Konverze</div>
          <div className="text-3xl font-bold text-stone-800">0</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="text-sm font-medium text-stone-500 mb-1">ROAS</div>
          <div className="text-3xl font-bold text-stone-800">0x</div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-stone-800">Google Ads</h3>
          </div>
          <div className="text-stone-500 text-sm">
            Připoj Google Ads účet v Settings
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">📘</span>
            </div>
            <h3 className="text-lg font-semibold text-stone-800">Meta Ads</h3>
          </div>
          <div className="text-stone-500 text-sm">Připoj Meta Ads účet v Settings</div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold text-stone-800">AI Doporučení</h3>
        </div>
        <div className="text-stone-600">
          Žádná doporučení. Nejprve připoj marketingové platformy.
        </div>
      </div>
    </div>
  );
}
