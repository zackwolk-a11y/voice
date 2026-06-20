'use client';

import { useState } from 'react';
import { HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ContactHub() {
  const { getHubItems, state, dispatch, deleteItem } = useStore();
  const [search, setSearch] = useState('');

  const cfg = HUB_CONFIG.contacts;
  const allItems = getHubItems('contacts');

  const items = allItems.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.contact?.role ?? '').toLowerCase().includes(q) ||
      (item.contact?.company ?? '').toLowerCase().includes(q) ||
      (item.contact?.email ?? '').toLowerCase().includes(q) ||
      item.tags.some((t) => t.includes(q))
    );
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
            CONTACTS
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', paddingLeft: '8px', marginTop: '1px' }}>
            People to reach, collaborators & network
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
            IN ROLODEX
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'contacts' })}
          className="btn-retro"
          style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark }}
        >
          + CONTACT
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people, roles, companies..."
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

      {/* Rolodex grid */}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '8px',
            }}
          >
            {items.map((item) => {
              const isSelected = state.selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  className="retro-card retro-card-interactive"
                  onClick={() =>
                    dispatch({ type: 'SELECT_ITEM', id: isSelected ? null : item.id })
                  }
                  style={{
                    borderTop: `3px solid ${cfg.color}`,
                    background: isSelected ? cfg.colorDark : 'var(--bg-card)',
                    padding: '0.6rem 0.75rem',
                    position: 'relative',
                  }}
                >
                  {/* Card header with initials */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        background: cfg.colorDark,
                        border: `2px solid ${cfg.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontSize: '16px',
                        color: cfg.color,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(item.title)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          letterSpacing: '0.05em',
                          color: isSelected ? cfg.color : 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </div>
                      {item.contact?.role && (
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px' }}>
                          {item.contact.role}
                          {item.contact.company && ` · ${item.contact.company}`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact details */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.4rem' }}>
                    {item.contact?.email && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-secondary)',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ✉ {item.contact.email}
                      </div>
                    )}
                    {item.contact?.phone && (
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        ☏ {item.contact.phone}
                      </div>
                    )}
                    {item.content && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-dim)',
                          marginTop: '4px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {item.content}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '6px' }}>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="tag-chip"
                          style={{ borderColor: cfg.colorDim, color: 'var(--text-dim)' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pin / delete */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      display: 'flex',
                      gap: '3px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_PIN', id: item.id })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: item.pinned ? cfg.color : 'var(--text-dim)',
                        fontSize: '11px',
                        padding: '1px 2px',
                      }}
                      title={item.pinned ? 'Unpin' : 'Pin'}
                    >
                      ◈
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete?')) deleteItem(item.id); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-dim)',
                        fontSize: '11px',
                        padding: '1px 2px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
