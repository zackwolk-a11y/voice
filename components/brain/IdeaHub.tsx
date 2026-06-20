'use client';

import { useState } from 'react';
import { IdeaStatus, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ItemCard } from './ItemCard';

const FILTERS: Array<IdeaStatus | 'all'> = ['all', 'spark', 'brewing', 'active', 'archived'];

export function IdeaHub() {
  const { getHubItems, dispatch } = useStore();
  const [filter, setFilter] = useState<IdeaStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const cfg = HUB_CONFIG.ideas;
  const allItems = getHubItems('ideas');
  const counts: Record<string, number> = {
    spark: allItems.filter((i) => i.ideaStatus === 'spark').length,
    brewing: allItems.filter((i) => i.ideaStatus === 'brewing').length,
    active: allItems.filter((i) => i.ideaStatus === 'active').length,
    archived: allItems.filter((i) => i.ideaStatus === 'archived').length,
  };

  const items = allItems.filter((item) => {
    if (filter !== 'all' && item.ideaStatus !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q) || item.tags.some((t) => t.includes(q));
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-mid)', background: cfg.colorDark, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="tape-label neon-text" style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: cfg.color }}>
            IDEAS
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'ideas' })}
            className="btn-retro btn-retro-sm"
            style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, boxShadow: `0 0 8px ${cfg.colorGlow}` }}>
            + SPARK
          </button>
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            const count = f === 'all' ? allItems.length : counts[f] ?? 0;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.08em',
                padding: '3px 8px', minHeight: 32,
                border: `1px solid ${active ? cfg.color : 'var(--border-mid)'}`,
                background: active ? cfg.colorDark : 'transparent',
                color: active ? cfg.color : 'var(--text-dim)',
                cursor: 'pointer',
                boxShadow: active ? `0 0 6px ${cfg.colorGlow}` : 'none',
                transition: 'all 80ms ease',
              }}>
                {f.toUpperCase()} <span style={{ opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ideas..."
          style={{ width: '100%', padding: '0.45rem 0.65rem', background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em' }}>
            {search ? 'No matches.' : cfg.emptyState}
          </div>
        ) : items.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
