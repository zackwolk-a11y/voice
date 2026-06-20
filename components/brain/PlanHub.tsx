'use client';

import { useState } from 'react';
import { HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ItemCard } from './ItemCard';

type PlanFilter = 'all' | 'active' | 'done' | 'overdue';

export function PlanHub() {
  const { getHubItems, dispatch } = useStore();
  const [filter, setFilter] = useState<PlanFilter>('all');
  const [search, setSearch] = useState('');

  const cfg = HUB_CONFIG.plans;
  const allItems = getHubItems('plans');
  const now = new Date();

  const isOverdue = (deadline?: string) => !!deadline && new Date(deadline) < now;
  const isDone = (item: (typeof allItems)[0]) => !!item.checklist?.length && item.checklist.every((c) => c.done);

  const items = allItems.filter((item) => {
    if (filter === 'done' && !isDone(item)) return false;
    if (filter === 'active' && isDone(item)) return false;
    if (filter === 'overdue' && !isOverdue(item.deadline)) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.checklist?.some((c) => c.text.toLowerCase().includes(q)) || item.tags.some((t) => t.includes(q));
    }
    return true;
  });

  const stats = {
    total: allItems.length,
    done: allItems.filter(isDone).length,
    overdue: allItems.filter((i) => isOverdue(i.deadline)).length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-mid)', background: cfg.colorDark, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="tape-label neon-text" style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: cfg.color }}>
            PLANS
          </span>
          <div style={{ flex: 1 }} />

          {/* Stats */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[['TOTAL', stats.total, cfg.color], ['DONE', stats.done, cfg.color], ['OVERDUE', stats.overdue, '#FF2B8A']].map(([label, val, col]) => (
              <div key={label as string} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: col as string, lineHeight: 1, textShadow: `0 0 8px ${col}` }}>{val}</div>
                <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>

          <button onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'plans' })}
            className="btn-retro btn-retro-sm"
            style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, boxShadow: `0 0 8px ${cfg.colorGlow}` }}>
            + PLAN
          </button>
        </div>
      </div>

      {/* Filters + search */}
      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
        {(['all', 'active', 'done', 'overdue'] as PlanFilter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.08em',
            padding: '3px 8px', minHeight: 32,
            border: `1px solid ${filter === f ? cfg.color : 'var(--border-mid)'}`,
            background: filter === f ? cfg.colorDark : 'transparent',
            color: filter === f ? cfg.color : 'var(--text-dim)',
            cursor: 'pointer', boxShadow: filter === f ? `0 0 6px ${cfg.colorGlow}` : 'none',
          }}>
            {f.toUpperCase()}
          </button>
        ))}
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plans..."
          style={{ flex: 1, minWidth: '100px', padding: '0.4rem 0.55rem', background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em' }}>
            {search || filter !== 'all' ? 'No matches.' : cfg.emptyState}
          </div>
        ) : items.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
