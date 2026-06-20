'use client';

import { HubType, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

const HUBS: HubType[] = ['ideas', 'plans', 'research', 'contacts', 'journal'];

function HubOverviewCard({ hub }: { hub: HubType }) {
  const { getHubItems, dispatch } = useStore();
  const cfg = HUB_CONFIG[hub];
  const items = getHubItems(hub);
  const recent = items.slice(0, 3);

  return (
    <div
      className="retro-card retro-card-interactive fade-up"
      onClick={() => dispatch({ type: 'SET_HUB', hub })}
      style={{
        borderTop: `3px solid ${cfg.color}`,
        boxShadow: `0 0 16px ${cfg.colorGlow}, 0 0 1px ${cfg.color}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 160,
      }}
    >
      {/* Card header */}
      <div style={{
        padding: '0.55rem 0.75rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        background: cfg.colorDark,
      }}>
        <span className="tape-label neon-text-sm" style={{
          fontFamily: 'var(--font-display)', fontSize: '18px',
          color: cfg.color, flex: 1, padding: '0 0.3rem 0 0.7rem',
        }}>
          {cfg.label}
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '22px',
          color: items.length > 0 ? cfg.color : 'var(--text-dim)',
          lineHeight: 1,
          textShadow: items.length > 0 ? `0 0 10px ${cfg.color}` : 'none',
        }}>
          {items.length}
        </span>
      </div>

      {/* Recent items */}
      <div style={{ flex: 1, padding: '0.25rem 0' }}>
        {recent.length === 0 ? (
          <div style={{ padding: '0.5rem 0.75rem', fontSize: '10px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            {cfg.emptyState.split('.')[0]}.
          </div>
        ) : (
          recent.map((item) => (
            <div key={item.id} style={{
              padding: '0.25rem 0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              borderBottom: '1px solid var(--border)',
            }}>
              {item.pinned && <span style={{ color: cfg.color, fontSize: '7px', flexShrink: 0, textShadow: `0 0 4px ${cfg.color}` }}>◈</span>}
              <span style={{
                fontSize: '11px', color: 'var(--text-secondary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
              }}>
                {item.title}
              </span>
              {item.isVoiceNote && <span style={{ fontSize: '9px', color: cfg.color, flexShrink: 0 }}>◉</span>}
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '0.3rem 0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          fontSize: '11px', color: cfg.color, letterSpacing: '0.12em',
          fontFamily: 'var(--font-display)',
          textShadow: `0 0 6px ${cfg.color}`,
        }}>
          OPEN →
        </span>
      </div>
    </div>
  );
}

export function Overview() {
  const { dispatch } = useStore();
  const now = new Date();

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
      {/* Date / greeting */}
      <div style={{ marginBottom: '0.75rem', paddingLeft: '2px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-dim)', marginBottom: '2px' }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          What&apos;s on the board?{' '}
          <button onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE' })}
            style={{ background: 'none', border: 'none', color: 'var(--pink)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.05em', padding: 0, textDecoration: 'underline', textShadow: '0 0 6px var(--pink)' }}>
            + CAPTURE
          </button>
        </div>
      </div>

      {/* Hub grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px',
      }}>
        {HUBS.map((hub) => <HubOverviewCard key={hub} hub={hub} />)}

        {/* Quick capture card */}
        <div
          className="retro-card retro-card-interactive"
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE' })}
          style={{
            border: '1px dashed var(--border-bright)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 160, gap: '0.5rem',
            background: 'var(--bg-deep)',
            boxShadow: 'none',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--border-bright)', lineHeight: 1 }}>+</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
            QUICK CAPTURE
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>⌘K</span>
        </div>
      </div>
    </div>
  );
}
