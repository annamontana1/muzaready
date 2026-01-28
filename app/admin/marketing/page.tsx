export default function MarketingOverviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview Dashboard</h2>
        <p className="text-slate-400">
          Přehled výkonu všech marketingových kanálů
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Celková útrata</div>
          <div className="text-2xl font-bold">0 Kč</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Celkové kliky</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Konverze</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">ROAS</div>
          <div className="text-2xl font-bold">0x</div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Google Ads</h3>
          <div className="text-slate-400">
            Připoj Google Ads účet v Settings
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Meta Ads</h3>
          <div className="text-slate-400">Připoj Meta Ads účet v Settings</div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🤖 AI Doporučení</h3>
        <div className="text-slate-400">
          Žádná doporučení. Nejprve připoj marketingové platformy.
        </div>
      </div>
    </div>
  );
}
