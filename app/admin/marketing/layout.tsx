"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: "/admin/marketing", icon: "📊" },
    { name: "Google Ads", href: "/admin/marketing/google-ads", icon: "🔍" },
    { name: "Meta Ads", href: "/admin/marketing/meta-ads", icon: "📘" },
    { name: "Settings", href: "/admin/marketing/settings", icon: "⚙️" },
  ];

  return (
    <div>
      {/* Header with AI Assistant Button */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/ai-assistant">
          <button className="px-4 py-2 bg-[#722F37] hover:bg-[#5a2529] text-white rounded-lg transition-colors font-medium flex items-center gap-2">
            <span>🤖</span>
            AI Assistant
          </button>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-stone-200 mb-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                px-5 py-3 border-b-2 transition-all flex items-center gap-2 font-medium text-sm
                ${
                  isActive
                    ? "border-[#722F37] text-[#722F37] bg-[#722F37]/5"
                    : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
