import { useState, useMemo } from "react";
import { Eyebrow, Tag } from "./ui";

import guidesData from "./data/guides.json";

interface Guide {
  id: string;
  title: string;
  category: string;
  body: string;
  excerpt?: string;
}

const REPO_GUIDES_URL = "https://github.com/UitbreidenOS/UitKit/blob/main/guides";

const guides = guidesData as Guide[];

const categories = [...new Set(guides.map(g => g.category))];

export function GuidesApp() {
  const [active, setActive] = useState("auto-mode");
  const [search, setSearch] = useState("");
  const [readGuides, setReadGuides] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uitkit_read_guides");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const filteredGuides = useMemo(() => {
    if (!search.trim()) return guides;
    const q = search.toLowerCase();
    return guides.filter(g => g.title.toLowerCase().includes(q) || g.body.toLowerCase().includes(q));
  }, [search]);

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => filteredGuides.some(g => g.category === cat));
  }, [filteredGuides]);

  const doc = filteredGuides.find(g => g.id === active) ?? filteredGuides[0];

  const handleToggleRead = (id: string) => {
    const nextRead = readGuides.includes(id)
      ? readGuides.filter((x) => x !== id)
      : [...readGuides, id];
    setReadGuides(nextRead);
    localStorage.setItem("uitkit_read_guides", JSON.stringify(nextRead));

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: {
        status: "happy",
        message: nextRead.includes(id) ? `Completed reading: ${id}` : `Marked unread: ${id}`
      }
    }));
  };

  const totalGuidesCount = guides.length;
  const readGuidesCount = guides.filter(g => readGuides.includes(g.id)).length;
  const readPercent = totalGuidesCount > 0 ? Math.round((readGuidesCount / totalGuidesCount) * 100) : 0;

  if (!doc) return <div className="p-6 text-mute text-sm">No guides found.</div>;

  return (
    <div className="h-full flex">
      <aside className="w-56 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3 pb-2 border-b border-hairline">
          <Eyebrow color="#1078a3">Knowledge Base</Eyebrow>
          
          {/* Progress bar */}
          <div className="mt-2 mb-3 bg-zinc-100 p-2 rounded-lg border border-hairline">
            <div className="flex justify-between items-center text-[10px] font-bold text-ink mb-1">
              <span>Read Tracker</span>
              <span>{readPercent}% ({readGuidesCount}/{totalGuidesCount})</span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${readPercent}%` }}
                className="bg-brand-blue h-full transition-all duration-300"
              />
            </div>
          </div>

          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActive(""); }}
            placeholder="Search guides..."
            className="w-full rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[12px] text-ink placeholder:text-mute/60 focus:outline-none focus:ring-1 focus:ring-brand-blue/40"
          />
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2">
          {filteredCategories.map(topic => (
            <div key={topic} className="mt-2 first:mt-0">
              <div className="text-[10px] font-bold text-mute uppercase tracking-wider px-2.5 py-1">{topic}</div>
              <div className="space-y-0.5">
                {filteredGuides.filter(g => g.category === topic).map(g => {
                  const isRead = readGuides.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => setActive(g.id)}
                      className={`w-full text-left rounded-md px-2.5 py-1.5 text-[12px] transition flex justify-between items-center ${
                        g.id === active ? "bg-white border border-hairline font-semibold text-brand-teal" : "text-body hover:bg-white/60"
                      }`}
                    >
                      <span className="truncate mr-1">{g.title}</span>
                      {isRead && <span className="text-emerald-500 font-bold text-[11px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-hairline text-[10px] text-mute flex justify-between">
          <span>{guides.length} guides</span>
          <button
            onClick={() => {
              setReadGuides([]);
              localStorage.removeItem("uitkit_read_guides");
            }}
            className="hover:text-red-500 font-semibold"
          >
            Reset
          </button>
        </div>
      </aside>

      <article className="flex-1 min-w-0 overflow-auto p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <Tag color="#1078a3">{doc.category}</Tag>
            <button
              onClick={() => handleToggleRead(doc.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition ${
                readGuides.includes(doc.id)
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-white border-hairline text-mute hover:bg-zinc-50 hover:text-ink"
              }`}
            >
              {readGuides.includes(doc.id) ? "✓ Completed" : "Mark as Read"}
            </button>
          </div>

          <h1 className="mt-2 text-xl font-extrabold text-ink">{doc.title}</h1>
          <p className="mt-3 text-[13px] text-body leading-relaxed max-w-xl">{doc.body}</p>

          {doc.excerpt && (
            <div className="mt-4 rounded-lg border border-hairline bg-cream/50 p-4 max-w-xl">
              <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-2">From the guide</div>
              <p className="text-[12.5px] text-body leading-relaxed">{doc.excerpt}</p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-hairline pt-5 flex flex-wrap gap-3">
          <a
            href={`${REPO_GUIDES_URL}/${doc.id}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-[12px] font-bold text-white hover:bg-body transition"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Read full guide on GitHub
          </a>
          <a
            href={`${REPO_GUIDES_URL}/${doc.id}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-white px-4 py-2.5 text-[12px] font-semibold text-body hover:bg-cream transition"
          >
            View raw markdown
          </a>
        </div>
      </article>
    </div>
  );
}
