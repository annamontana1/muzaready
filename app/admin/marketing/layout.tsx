"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, Search, Facebook, Settings } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: "/admin/marketing", icon: BarChart3 },
    { name: "Google Ads", href: "/admin/marketing/google-ads", icon: Search },
    { name: "Meta Ads", href: "/admin/marketing/meta-ads", icon: Facebook },
    { name: "Settings", href: "/admin/marketing/settings", icon: Settings },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📊 Marketing</h1>
        <Link href="/admin/ai-assistant">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            🤖 AI Assistant
          </button>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700 mb-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                px-4 py-3 border-b-2 transition-colors flex items-center gap-2
                ${
                  isActive
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }
              `}
            >
              <Icon className="w-4 h-4" />
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
