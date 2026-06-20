'use client';

import { BrainItem, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ItemCard({ item }: { item: BrainItem }) {
  const { state, dispatch, deleteItem } = useStore();
  const cfg = HUB_CONFIG[item.hub];
  const isSelected = state.selectedItemId === item.id;
  const doneCount = item.checklist?.filter((c) => c.done).length ?? 0;
  const totalCount = item.checklist?.length ?? 0;

  return (
    <div
      className="retro-card retro-card-interactive fade-up"
      onClick={() => dispatch({ type: 'SELECT_ITEM', id: isSelected ? null : item.id })}
      style={{
        borderLeft: `3px solid ${isSelected ? cfg.color : 'var(--border-mid)'}`,
        background: isSelected ? cfg.colorDark : 'var(--bg-card)',
        boxShadow: isSelected ? `0 0 12px ${cfg.colorGlow}, inset 0 0 20px rgba(0,0,0,0.4)` : 'none',
        transition: 'all 80ms ease',
      }}
    >
      <div style={{ padding: '0.55rem 0.65rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        {/* Pin dot */}
        {item.pinned && (
          <span className="pin-dot" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}`, marginTop: 5 }} />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em',
            color: isSelected ? cfg.color : 'var(--text-primary)',
            textShadow: isSelected ? `0 0 6px ${cfg.color}` : 'none',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.title}
          </div>

          {/* Content preview */}
          {item.content && (
            <div style={{
              color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px',
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.5',
            }}>
              {item.content}
            </div>
          )}

          {/* Checklist progress bar */}
          {totalCount > 0 && (
            <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--border-mid)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(doneCount / totalCount) * 100}%`,
                  background: cfg.color,
                  boxShadow: `0 0 4px ${cfg.color}`,
                  transition: 'width 200ms ease',
                }} />
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{doneCount}/{totalCount}</span>
            </div>
          )}

          {/* Contact */}
          {item.contact?.role && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px' }}>
              {item.contact.role}{item.contact.company ? ` · ${item.contact.company}` : ''}
            </div>
          )}

          {/* Source */}
          {item.source && (
            <div style={{ color: 'var(--amber-dim)', fontSize: '10px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              ↗ {item.source}
            </div>
          )}

          {/* Deadline */}
          {item.deadline && (
            <div style={{ color: 'var(--cyan-dim)', fontSize: '10px', marginTop: '2px' }}>
              ⏐ {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}

          {/* Idea status */}
          {item.ideaStatus && (
            <span style={{
              display: 'inline-block', marginTop: '4px', fontSize: '9px',
              fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em',
              padding: '1px 6px', border: `1px solid ${cfg.color}`, color: cfg.color,
              boxShadow: `0 0 4px ${cfg.colorGlow}`, opacity: 0.85,
            }}>
              {item.ideaStatus}
            </span>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '5px' }}>
              {item.tags.map((tag) => (
                <span key={tag} className="tag-chip" style={{ borderColor: 'var(--border-bright)', color: 'var(--text-dim)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right meta */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
          <span style={{ fontSize: '9px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
            {formatDate(item.updatedAt)}
          </span>
          {item.isVoiceNote && (
            <span style={{ fontSize: '10px', color: cfg.color, textShadow: `0 0 4px ${cfg.color}` }}>◉</span>
          )}
          <div style={{ display: 'flex', gap: '2px' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => dispatch({ type: 'TOGGLE_PIN', id: item.id })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.pinned ? cfg.color : 'var(--text-dim)', fontSize: '12px', padding: '4px', minHeight: 32, minWidth: 28 }}
              title={item.pinned ? 'Unpin' : 'Pin'}>
              ◈
            </button>
            <button onClick={() => { if (confirm('Delete?')) deleteItem(item.id); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '12px', padding: '4px', minHeight: 32, minWidth: 28 }}>
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
