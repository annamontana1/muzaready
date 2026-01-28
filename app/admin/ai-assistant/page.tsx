export default function AIAssistantPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-800 mb-2">🤖 AI Marketing Assistant</h2>
        <p className="text-stone-500">
          Váš osobní AI marketingový expert pro Muzahair.cz
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          RYCHLÉ AKCE
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { emoji: "📊", label: "Týdenní Report", desc: "Přehled výkonu" },
            { emoji: "🔍", label: "Detailní Analýza", desc: "Detailní analýza" },
            { emoji: "🚀", label: "Nová Kampaň", desc: "Návrh kampaně" },
            { emoji: "💡", label: "Keyword Analýza", desc: "Hledat keywords" },
            { emoji: "🎨", label: "Creative Ideas", desc: "Nápady na kreativy" },
            { emoji: "⚠️", label: "Najdi Problémy", desc: "Diagnostika" },
          ].map((action) => (
            <button
              key={action.label}
              className="bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm rounded-xl p-4 text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{action.emoji}</span>
                <div className="font-semibold text-stone-800 text-sm">{action.label}</div>
              </div>
              <div className="text-xs text-stone-500">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm mb-3">
            <span>ℹ️</span>
            <span className="font-medium">Chat s AI asistentem bude implementován ve Fázi 5</span>
          </div>
          <p className="text-sm text-stone-500">
            Nejprve potřebuješ připojit Meta Ads a Google Ads v Settings
          </p>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Zeptej se na cokoliv..."
            disabled
            className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/10 disabled:opacity-50 disabled:cursor-not-allowed text-stone-800 placeholder:text-stone-400"
          />
          <button
            disabled
            className="px-6 py-3 bg-[#722F37] hover:bg-[#5a2529] disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            Odeslat
          </button>
        </div>
      </div>
    </div>
  );
}
