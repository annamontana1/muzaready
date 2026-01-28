export default function AIAssistantPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🤖 AI Marketing Assistant</h2>
        <p className="text-slate-400">
          Váš osobní AI marketingový expert pro Muzahair.cz
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">
          RYCHLÉ AKCE
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "📊 Týdenní Report", desc: "Přehled výkonu" },
            { label: "🔍 Analyzuj Výkon", desc: "Detailní analýza" },
            { label: "🚀 Nová Kampaň", desc: "Návrh kampaně" },
            { label: "💡 Keyword Analýza", desc: "Hledat keywords" },
            { label: "🎨 Creative Ideas", desc: "Nápady na kreativy" },
            { label: "⚠️ Najdi Problémy", desc: "Diagnostika" },
          ].map((action) => (
            <button
              key={action.label}
              className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 text-left transition-colors"
            >
              <div className="font-medium mb-1">{action.label}</div>
              <div className="text-sm text-slate-400">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="mb-4 text-center text-slate-400">
          <p>Chat s AI asistentem bude implementován ve Fázi 5</p>
          <p className="text-sm mt-2">
            Nejprve potřebuješ připojit Meta Ads a Google Ads v Settings
          </p>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Zeptej se na cokoliv..."
            disabled
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            disabled
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Odeslat
          </button>
        </div>
      </div>
    </div>
  );
}
