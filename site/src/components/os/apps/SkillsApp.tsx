import { useState, useMemo, useEffect } from "react";
import { Eyebrow, Tag } from "./ui";
import catalogData from "./catalog.json";

interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  assets: { skills: number };
}

interface SkillDef {
  name: string;
  icon: string;
  count: number;
  desc: string;
  items: CatalogEntry[];
}

export function SkillsApp() {
  const [categories, setCategories] = useState<SkillDef[]>([]);
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const entries = (catalogData as any).entries || (catalogData as any).default?.entries || [];
    const grouped: Record<string, SkillDef> = {};

    entries.forEach((entry: CatalogEntry) => {
      const catName = entry.category
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      if (!grouped[catName]) {
        grouped[catName] = {
          name: catName,
          icon: entry.icon || "📚",
          count: 0,
          desc: "",
          items: []
        };
      }
      grouped[catName].count += entry.assets?.skills || 0;
      grouped[catName].items.push(entry);
    });

    const cats = Object.values(grouped).sort((a, b) => b.count - a.count);
    setCategories(cats);
  }, []);

  if (categories.length === 0) return <div className="p-6">Loading...</div>;

  const cat = categories[active] || categories[0] || { name: "", icon: "📚", count: 0, items: [] };
  const filtered = useMemo(() => {
    if (!cat || !cat.items) return [];
    if (!search) return cat.items;
    return cat.items.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [cat, search]);

  return (
    <div className="h-full flex flex-col sm:flex-row">
      <aside className="sm:w-56 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3 pb-2">
          <Eyebrow color="#1d4aff">Skills Catalog</Eyebrow>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="mt-2 w-full rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[12px] text-ink placeholder:text-mute/60 focus:outline-none focus:ring-1 focus:ring-brand-blue/40"
          />
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
          {categories.map((c, i) => (
            <button
              key={c.name}
              onClick={() => { setActive(i); setSearch(""); }}
              className={`w-full text-left flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition ${
                i === active ? "bg-white border border-hairline text-ink" : "text-body hover:bg-white/60"
              }`}
            >
              <span>{c.icon}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-[10px] text-mute">{c.count}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-hairline text-[10px] text-mute">
          {categories.reduce((sum, c) => sum + c.count, 0)} skills in {categories.length} categories
        </div>
      </aside>

      <div className="flex-1 min-w-0 overflow-auto p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cat.icon}</span>
          <h1 className="text-xl font-extrabold text-ink">{cat.name}</h1>
          <Tag color="#1d4aff">{cat.count} skills</Tag>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-hairline bg-white px-3.5 py-3 text-[12px] hover:border-brand-blue/40 transition">
              <div className="font-semibold text-ink text-[13px]">{entry.name}</div>
              <div className="mt-1.5 text-[11px] text-body line-clamp-2">{entry.description}</div>
              <div className="mt-2 text-[10px] text-mute">{entry.assets?.skills || 0} skills</div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 text-center text-sm text-mute">No stacks matching "{search}"</div>
        )}

        <div className="mt-5 rounded-lg border-l-4 border-brand-blue bg-brand-blue/10 px-4 py-3 text-[12px] text-body">
          💡 <strong>Browse {categories.length} stack categories</strong> — each contains specialized skills for your role
        </div>
      </div>
    </div>
  );
}
