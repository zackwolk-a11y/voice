'use client';

import { useState } from 'react';
import { HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ItemCard } from './ItemCard';

export function ResearchHub() {
  const { getHubItems, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const cfg = HUB_CONFIG.research;
  const allItems = getHubItems('research');
  const allTags = Array.from(new Set(allItems.flatMap((i) => i.tags))).sort();

  const items = allItems.filter((item) => {
    if (activeTag && !item.tags.includes(activeTag)) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q) || (item.source ?? '').toLowerCase().includes(q) || item.tags.some((t) => t.includes(q));
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-mid)', background: cfg.colorDark, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="tape-label neon-text" style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: cfg.color }}>
            RESEARCH
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: cfg.color, lineHeight: 1, textShadow: `0 0 8px ${cfg.color}` }}>{allItems.length}</div>
            <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>REFS</div>
          </div>
          <button onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'research' })}
            className="btn-retro btn-retro-sm"
            style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, boxShadow: `0 0 8px ${cfg.colorGlow}` }}>
            + FILE
          </button>
        </div>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginRight: '2px' }}>TOPICS:</span>
          <button onClick={() => setActiveTag(null)} className="tag-chip" style={{ borderColor: !activeTag ? cfg.color : 'var(--border-mid)', color: !activeTag ? cfg.color : 'var(--text-dim)', cursor: 'pointer', background: 'none', boxShadow: !activeTag ? `0 0 4px ${cfg.colorGlow}` : 'none', minHeight: 28 }}>all</button>
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className="tag-chip"
              style={{ borderColor: activeTag === tag ? cfg.color : 'var(--border-mid)', color: activeTag === tag ? cfg.color : 'var(--text-dim)', cursor: 'pointer', background: 'none', boxShadow: activeTag === tag ? `0 0 4px ${cfg.colorGlow}` : 'none', minHeight: 28 }}>
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search references, notes, sources..."
          style={{ width: '100%', padding: '0.45rem 0.65rem', background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em' }}>
            {search || activeTag ? 'No matches.' : cfg.emptyState}
          </div>
        ) : items.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
