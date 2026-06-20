'use client';

import { HubType, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

const HUBS: HubType[] = ['ideas', 'plans', 'research', 'contacts', 'journal'];

function HubOverviewCard({ hub }: { hub: HubType }) {
  const { getHubItems, dispatch } = useStore();
  const cfg = HUB_CONFIG[hub];
  const items = getHubItems(hub);
  const pinned = items.filter((i) => i.pinned);
  const recent = items.slice(0, 3);

  return (
    <div
      className="retro-card retro-card-interactive"
      onClick={() => dispatch({ type: 'SET_HUB', hub })}
      style={{
        borderTop: `3px solid ${cfg.color}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '180px',
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: '0.6rem 0.75rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            letterSpacing: '0.1em',
            color: cfg.color,
            flex: 1,
          }}
        >
          {cfg.label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: items.length > 0 ? cfg.color : 'var(--text-dim)',
            lineHeight: 1,
          }}
        >
          {items.length}
        </span>
      </div>

      {/* Recent items */}
      <div style={{ flex: 1, padding: '0.5rem 0' }}>
        {recent.length === 0 ? (
          <div
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '10px',
              color: 'var(--text-dim)',
              fontStyle: 'italic',
            }}
          >
            {cfg.emptyState.split('.')[0]}.
          </div>
        ) : (
          recent.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '0.25rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {item.pinned && (
                <span style={{ color: cfg.color, fontSize: '8px' }}>◈</span>
              )}
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {item.title}
              </span>
              {item.isVoiceNote && (
                <span style={{ fontSize: '9px', color: cfg.color }}>◉</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer: open arrow */}
      <div
        style={{
          padding: '0.3rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <span style={{ fontSize: '10px', color: cfg.color, letterSpacing: '0.1em', fontFamily: 'var(--font-display)' }}>
          OPEN →
        </span>
      </div>
    </div>
  );
}

export function Overview() {
  const { state, dispatch } = useStore();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
      {/* Welcome header */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'var(--text-dim)',
            marginBottom: '4px',
          }}
        >
          {dateStr.toUpperCase()} · {timeStr}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
          }}
        >
          What's on your mind? Tap a hub to dive in, or{' '}
          <button
            onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE' })}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--mustard)',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              letterSpacing: '0.08em',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            + QUICK CAPTURE
          </button>{' '}
          to fire and forget.
        </div>
      </div>

      {/* Hub grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '8px',
        }}
      >
        {HUBS.map((hub) => (
          <HubOverviewCard key={hub} hub={hub} />
        ))}

        {/* Quick capture card */}
        <div
          className="retro-card retro-card-interactive"
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE' })}
          style={{
            border: '1px dashed var(--border-bright)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '180px',
            gap: '0.5rem',
            background: 'var(--bg-deep)',
            boxShadow: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              color: 'var(--border-bright)',
              lineHeight: 1,
            }}
          >
            +
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              letterSpacing: '0.1em',
              color: 'var(--text-dim)',
            }}
          >
            QUICK CAPTURE
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-dim)',
              textAlign: 'center',
              padding: '0 1rem',
            }}
          >
            ⌘K from anywhere
          </span>
        </div>
      </div>
    </div>
  );
}
