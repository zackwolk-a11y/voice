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

  // Collect all tags
  const allTags = Array.from(
    new Set(allItems.flatMap((i) => i.tags))
  ).sort();

  const items = allItems.filter((item) => {
    if (activeTag && !item.tags.includes(activeTag)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        (item.source ?? '').toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Hub header */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border-mid)',
          background: cfg.colorDark,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            className="tape-label"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              letterSpacing: '0.1em',
              color: cfg.color,
            }}
          >
            RESEARCH
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', paddingLeft: '8px', marginTop: '1px' }}>
            Deep dives, articles & references
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              color: cfg.color,
              lineHeight: 1,
            }}
          >
            {allItems.length}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            REFERENCES
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'research' })}
          className="btn-retro"
          style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark }}
        >
          + FILE
        </button>
      </div>

      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div
          style={{
            padding: '0.4rem 1rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginRight: '4px' }}>
            TOPICS:
          </span>
          <button
            onClick={() => setActiveTag(null)}
            className="tag-chip"
            style={{
              borderColor: !activeTag ? cfg.color : 'var(--border-mid)',
              color: !activeTag ? cfg.color : 'var(--text-dim)',
              cursor: 'pointer',
              background: 'none',
            }}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="tag-chip"
              style={{
                borderColor: activeTag === tag ? cfg.color : 'var(--border-mid)',
                color: activeTag === tag ? cfg.color : 'var(--text-dim)',
                cursor: 'pointer',
                background: 'none',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search references, notes, sources..."
          style={{
            width: '100%',
            padding: '0.35rem 0.6rem',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
          }}
        />
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1rem' }}>
        {items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              letterSpacing: '0.05em',
            }}
          >
            {search || activeTag ? 'No matches.' : cfg.emptyState}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
