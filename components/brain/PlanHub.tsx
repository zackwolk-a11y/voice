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

  function isOverdue(deadline?: string) {
    if (!deadline) return false;
    return new Date(deadline) < now;
  }

  function isDone(item: (typeof allItems)[0]) {
    if (!item.checklist || item.checklist.length === 0) return false;
    return item.checklist.every((c) => c.done);
  }

  const items = allItems.filter((item) => {
    if (filter === 'done' && !isDone(item)) return false;
    if (filter === 'active' && isDone(item)) return false;
    if (filter === 'overdue' && !isOverdue(item.deadline)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.checklist?.some((c) => c.text.toLowerCase().includes(q)) ||
        item.tags.some((t) => t.includes(q))
      );
    }
    return true;
  });

  const overdueCount = allItems.filter((i) => isOverdue(i.deadline)).length;
  const doneCount = allItems.filter((i) => isDone(i)).length;

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
            PLANS
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', paddingLeft: '8px', marginTop: '1px' }}>
            Logistics, roadmaps & checklists
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { label: 'TOTAL', val: allItems.length },
            { label: 'DONE', val: doneCount },
            { label: 'OVERDUE', val: overdueCount },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  color: label === 'OVERDUE' && val > 0 ? '#C15B38' : cfg.color,
                  lineHeight: 1,
                }}
              >
                {val}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'plans' })}
          className="btn-retro"
          style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark }}
        >
          + PLAN
        </button>
      </div>

      {/* Filters + search */}
      <div
        style={{
          padding: '0.5rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {(['all', 'active', 'done', 'overdue'] as PlanFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              padding: '2px 8px',
              border: `1px solid ${filter === f ? cfg.color : 'var(--border-mid)'}`,
              background: filter === f ? cfg.colorDark : 'transparent',
              color: filter === f ? cfg.color : 'var(--text-dim)',
              cursor: 'pointer',
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plans..."
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '0.3rem 0.5rem',
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
            {search || filter !== 'all' ? 'No matches.' : cfg.emptyState}
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
