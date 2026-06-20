'use client';

import { BrainItem, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

interface ItemCardProps {
  item: BrainItem;
  compact?: boolean;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

export function ItemCard({ item, compact = false }: ItemCardProps) {
  const { state, dispatch, deleteItem } = useStore();
  const cfg = HUB_CONFIG[item.hub];
  const isSelected = state.selectedItemId === item.id;

  const doneCount = item.checklist?.filter((c) => c.done).length ?? 0;
  const totalCount = item.checklist?.length ?? 0;

  return (
    <div
      className="retro-card retro-card-interactive fade-up"
      onClick={() =>
        dispatch({
          type: 'SELECT_ITEM',
          id: isSelected ? null : item.id,
        })
      }
      style={{
        borderLeft: `3px solid ${isSelected ? cfg.color : 'var(--border-mid)'}`,
        background: isSelected ? cfg.colorDark : 'var(--bg-card)',
        transition: 'all 80ms ease',
        position: 'relative',
      }}
    >
      {/* Top row */}
      <div
        style={{
          padding: compact ? '0.4rem 0.6rem' : '0.55rem 0.75rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
        }}
      >
        {item.pinned && (
          <span
            className="pin-indicator"
            style={{ background: cfg.color, marginTop: '4px' }}
            title="Pinned"
          />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: compact ? '14px' : '16px',
              letterSpacing: '0.05em',
              color: isSelected ? cfg.color : 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title}
          </div>

          {!compact && (
            <>
              {/* Content preview */}
              {item.content && (
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    marginTop: '2px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5',
                  }}
                >
                  {item.content}
                </div>
              )}

              {/* Checklist progress */}
              {item.checklist && item.checklist.length > 0 && (
                <div
                  style={{
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '3px',
                      background: 'var(--border-mid)',
                      borderRadius: '0',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%`,
                        background: cfg.color,
                        transition: 'width 200ms ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {doneCount}/{totalCount}
                  </span>
                </div>
              )}

              {/* Contact info */}
              {item.contact && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px' }}>
                  {item.contact.role}{item.contact.company ? ` · ${item.contact.company}` : ''}
                </div>
              )}

              {/* Source */}
              {item.source && (
                <div
                  style={{
                    color: 'var(--terra-dim)',
                    fontSize: '10px',
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ↗ {item.source}
                </div>
              )}

              {/* Deadline */}
              {item.deadline && (
                <div style={{ color: 'var(--mustard-dim)', fontSize: '10px', marginTop: '2px' }}>
                  ⏐ {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}

              {/* Status badge for ideas */}
              {item.ideaStatus && (
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    fontSize: '9px',
                    fontFamily: 'var(--font-body)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '1px 5px',
                    border: `1px solid ${cfg.color}`,
                    color: cfg.color,
                    opacity: 0.7,
                  }}
                >
                  {item.ideaStatus}
                </span>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '5px' }}>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-chip"
                      style={{ borderColor: 'var(--border-bright)', color: 'var(--text-dim)' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right meta */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '9px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
            {formatDate(item.updatedAt)}
          </span>

          {/* Voice note indicator */}
          {item.isVoiceNote && (
            <span style={{ fontSize: '10px', color: cfg.color }} title="Voice note">
              ◉
            </span>
          )}

          {/* Action buttons on hover */}
          <div
            style={{ display: 'flex', gap: '3px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PIN', id: item.id })}
              title={item.pinned ? 'Unpin' : 'Pin'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: item.pinned ? cfg.color : 'var(--text-dim)',
                fontSize: '11px',
                padding: '1px 3px',
                lineHeight: 1,
              }}
            >
              ◈
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this item?')) deleteItem(item.id);
              }}
              title="Delete"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-dim)',
                fontSize: '11px',
                padding: '1px 3px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
