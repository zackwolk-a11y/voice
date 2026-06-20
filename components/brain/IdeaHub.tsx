'use client';

import { useState } from 'react';
import { IdeaStatus, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ItemCard } from './ItemCard';

const FILTERS: Array<IdeaStatus | 'all'> = ['all', 'spark', 'brewing', 'active', 'archived'];

const STATUS_COLORS: Record<IdeaStatus, string> = {
  spark: '#D4A017',
  brewing: '#C15B38',
  active: '#3D8B8C',
  archived: '#5A5040',
};

export function IdeaHub() {
  const { getHubItems, dispatch } = useStore();
  const [filter, setFilter] = useState<IdeaStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const cfg = HUB_CONFIG.ideas;
  const allItems = getHubItems('ideas');

  const items = allItems.filter((item) => {
    if (filter !== 'all' && item.ideaStatus !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q))
      );
    }
    return true;
  });

  const counts = {
    spark: allItems.filter((i) => i.ideaStatus === 'spark').length,
    brewing: allItems.filter((i) => i.ideaStatus === 'brewing').length,
    active: allItems.filter((i) => i.ideaStatus === 'active').length,
    archived: allItems.filter((i) => i.ideaStatus === 'archived').length,
  };

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
            IDEAS
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', paddingLeft: '8px', marginTop: '1px' }}>
            Creative sparks & project concepts
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => {
            const isActive = filter === f;
            const color = f === 'all' ? cfg.color : STATUS_COLORS[f as IdeaStatus];
            const count = f === 'all' ? allItems.length : counts[f as IdeaStatus];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  padding: '2px 8px',
                  border: `1px solid ${isActive ? color : 'var(--border-mid)'}`,
                  background: isActive ? cfg.colorDark : 'transparent',
                  color: isActive ? color : 'var(--text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {f.toUpperCase()}
                <span style={{ fontSize: '10px', opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'ideas' })}
          className="btn-retro"
          style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark }}
        >
          + SPARK
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ideas..."
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
            {search ? 'No matches.' : cfg.emptyState}
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
