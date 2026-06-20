'use client';

import { useState } from 'react';
import { HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function ContactHub() {
  const { getHubItems, state, dispatch, deleteItem } = useStore();
  const [search, setSearch] = useState('');

  const cfg = HUB_CONFIG.contacts;
  const allItems = getHubItems('contacts');
  const items = allItems.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return item.title.toLowerCase().includes(q) || (item.contact?.role ?? '').toLowerCase().includes(q) || (item.contact?.company ?? '').toLowerCase().includes(q) || (item.contact?.email ?? '').toLowerCase().includes(q) || item.tags.some((t) => t.includes(q));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-mid)', background: cfg.colorDark, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="tape-label neon-text" style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: cfg.color }}>
            CONTACTS
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: cfg.color, lineHeight: 1, textShadow: `0 0 8px ${cfg.color}` }}>{allItems.length}</div>
            <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>PEOPLE</div>
          </div>
          <button onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'contacts' })}
            className="btn-retro btn-retro-sm"
            style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, boxShadow: `0 0 8px ${cfg.colorGlow}` }}>
            + CONTACT
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people, roles, companies..."
          style={{ width: '100%', padding: '0.45rem 0.65rem', background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
      </div>

      {/* Rolodex grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.65rem 0.75rem' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em' }}>
            {search ? 'No matches.' : cfg.emptyState}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {items.map((item) => {
              const isSelected = state.selectedItemId === item.id;
              return (
                <div key={item.id}
                  className="retro-card retro-card-interactive"
                  onClick={() => dispatch({ type: 'SELECT_ITEM', id: isSelected ? null : item.id })}
                  style={{
                    borderTop: `3px solid ${cfg.color}`,
                    background: isSelected ? cfg.colorDark : 'var(--bg-card)',
                    padding: '0.6rem 0.7rem',
                    boxShadow: isSelected ? `0 0 14px ${cfg.colorGlow}` : `0 0 8px ${cfg.colorGlow}`,
                    position: 'relative',
                  }}
                >
                  {/* Initials + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.4rem' }}>
                    <div style={{
                      width: 38, height: 38, flexShrink: 0,
                      background: cfg.colorDark,
                      border: `2px solid ${cfg.color}`,
                      boxShadow: `0 0 8px ${cfg.colorGlow}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '16px', color: cfg.color,
                      textShadow: `0 0 6px ${cfg.color}`,
                    }}>
                      {getInitials(item.title)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: isSelected ? cfg.color : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: isSelected ? `0 0 6px ${cfg.color}` : 'none' }}>
                        {item.title}
                      </div>
                      {item.contact?.role && (
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.contact.role}{item.contact.company ? ` · ${item.contact.company}` : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact details */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.35rem' }}>
                    {item.contact?.email && (
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        ✉ {item.contact.email}
                      </div>
                    )}
                    {item.contact?.phone && (
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        ☏ {item.contact.phone}
                      </div>
                    )}
                    {item.content && (
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '3px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.content}
                      </div>
                    )}
                  </div>

                  {item.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '6px' }}>
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag-chip" style={{ borderColor: cfg.colorDim, color: 'var(--text-dim)' }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: '2px' }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => dispatch({ type: 'TOGGLE_PIN', id: item.id })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.pinned ? cfg.color : 'var(--text-dim)', fontSize: '12px', padding: '4px', minHeight: 32 }}>
                      ◈
                    </button>
                    <button onClick={() => { if (confirm('Delete?')) deleteItem(item.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '12px', padding: '4px', minHeight: 32 }}>
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
