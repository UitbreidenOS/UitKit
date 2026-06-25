import { useState, useEffect } from "react";
import { Eyebrow, Card, YellowButton } from "./ui";

interface KeywordOpportunity {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  recommendation: string;
}

const PRESET_KEYWORDS: KeywordOpportunity[] = [
  { keyword: "claude code configuration", clicks: 14500, impressions: 180000, ctr: 8.0, position: 4.2, recommendation: "Write guide on advanced slash settings." },
  { keyword: "mcp server list", clicks: 8200, impressions: 140000, ctr: 5.8, position: 8.9, recommendation: "Build interactive directory index." },
  { keyword: "ai verify loop system", clicks: 2300, impressions: 85000, ctr: 2.7, position: 14.5, recommendation: "Draft high-intent case study on loop engineering." },
  { keyword: "uitkit cli setup", clicks: 1200, impressions: 32000, ctr: 3.7, position: 9.1, recommendation: "Add quick-copy installer snippets." },
];

export function SearchConsoleApp() {
  const [keywords, setKeywords] = useState<KeywordOpportunity[]>(PRESET_KEYWORDS);
  const [selectedKw, setSelectedKw] = useState<KeywordOpportunity | null>(PRESET_KEYWORDS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string>("");

  const handleGenerateRecommendation = (kw: KeywordOpportunity) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setSelectedKw(kw);
    setGeneratedDraft("");

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Analyzing keyword parameters..." }
    }));
  };

  useEffect(() => {
    if (!isGenerating || !selectedKw) return;

    const timer = setTimeout(() => {
      setGeneratedDraft(`### 📝 SEO Recommendation for: "${selectedKw.keyword}"
- **Target H1:** Complete Guide to ${selectedKw.keyword} in 2026
- **Focus Keywords:** config schemas, JIT compilation context, token savings guidelines.
- **Suggested Outline:**
  1. Introduction: Bypassing manual parameters.
  2. Step-by-Step setup checklist.
  3. Cost comparisons (slashing prompt weight by 45%).
- **Internal Links:** Connect to Memory Galaxy and Swarm Sandbox guides.`);
      setIsGenerating(false);

      // Celebrate with Sidekick Pet
      window.dispatchEvent(new CustomEvent("sidekick_status_change", {
        detail: { status: "done", message: `SEO recommendation drafted!` }
      }));
    }, 2500);

    return () => clearTimeout(timer);
  }, [isGenerating, selectedKw]);

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex items-center gap-3">
        <span className="text-4xl">🔍</span>
        <div>
          <Eyebrow color="#f59e0b">Search Console Engine</Eyebrow>
          <h1 className="text-xl font-extrabold text-ink">SEO Analytics & Insights</h1>
        </div>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {[
          { label: "Total Clicks", value: "26.2k", icon: "🖱️", color: "text-blue-500" },
          { label: "Impressions", value: "437k", icon: "👁️", color: "text-indigo-500" },
          { label: "Average CTR", value: "6.0%", icon: "📊", color: "text-emerald-500" },
          { label: "Average Position", value: "9.1", icon: "🏁", color: "text-amber-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-hairline p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-mute uppercase">{item.label}</span>
              <div className="text-xl font-extrabold text-ink mt-1">{item.value}</div>
            </div>
            <span className={`text-xl ${item.color}`}>{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Split details view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-[300px]">
        {/* Left Column: Keyword list */}
        <Card className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-[13px] font-bold text-ink border-b border-hairline pb-1.5">Keyword Opportunities</h3>
          <div className="overflow-x-auto text-[12px] flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline text-mute">
                  <th className="pb-2 font-bold uppercase text-[9px]">Query Term</th>
                  <th className="pb-2 font-bold uppercase text-[9px]">Clicks</th>
                  <th className="pb-2 font-bold uppercase text-[9px]">CTR</th>
                  <th className="pb-2 font-bold uppercase text-[9px]">Avg. Pos</th>
                  <th className="pb-2 font-bold uppercase text-[9px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {keywords.map((kw, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-semibold text-ink">{kw.keyword}</td>
                    <td className="py-2.5 font-mono text-zinc-550">{kw.clicks.toLocaleString()}</td>
                    <td className="py-2.5 font-mono text-zinc-550">{kw.ctr}%</td>
                    <td className="py-2.5 font-mono text-zinc-550">{kw.position}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleGenerateRecommendation(kw)}
                        className="text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded shadow-sm transition"
                      >
                        Draft Brief
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: AI Recommendations */}
        <Card className="flex flex-col gap-3">
          <h3 className="text-[13px] font-bold text-ink border-b border-hairline pb-1.5">AI Content Recommendation</h3>
          
          {isGenerating ? (
            <div className="flex-1 flex flex-col justify-center items-center py-10">
              <span className="inline-block size-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mb-2"></span>
              <span className="text-[11px] text-mute font-mono">Analyzing search competitor gaps...</span>
            </div>
          ) : generatedDraft ? (
            <div className="flex-1 overflow-y-auto text-[12.5px] leading-relaxed text-body bg-zinc-950 text-zinc-100 p-4 rounded-xl font-mono whitespace-pre-wrap">
              {generatedDraft}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-mute py-8">
              <span className="text-4xl mb-2">💡</span>
              <h4 className="font-bold text-ink text-[13px]">Select Keyword Query</h4>
              <p className="text-[12px] max-w-xs mt-1 leading-normal">
                Click 'Draft Brief' on any keyword item to generate content guidelines.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
