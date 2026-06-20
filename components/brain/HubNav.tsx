'use client';

import { HubType, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

const HUBS: HubType[] = ['ideas', 'plans', 'research', 'contacts', 'journal'];

export function HubNav() {
  const { state, dispatch, getHubItems } = useStore();
  const { activeHub } = state;

  const tabStyle = (isActive: boolean, color: string, glow: string): React.CSSProperties => ({
    padding: '0.55rem 0.85rem',
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    letterSpacing: '0.1em',
    color: isActive ? color : 'var(--text-dim)',
    background: isActive ? 'var(--bg-card)' : 'transparent',
    border: 'none',
    borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
    borderRight: '1px solid var(--border)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    whiteSpace: 'nowrap',
    marginBottom: '-1px',
    transition: 'all 80ms ease',
    flexShrink: 0,
    position: 'relative',
    textShadow: isActive ? `0 0 8px ${color}` : 'none',
  });

  return (
    <nav style={{
      background: 'var(--bg-deep)',
      borderBottom: '1px solid var(--border-mid)',
      display: 'flex',
      alignItems: 'stretch',
      overflowX: 'auto',
      flexShrink: 0,
    }}>
      {/* HOME */}
      <button
        onClick={() => dispatch({ type: 'SET_HUB', hub: 'home' })}
        style={tabStyle(activeHub === 'home', 'var(--text-primary)', 'rgba(237,224,255,0.2)')}
      >
        <span style={{ fontSize: '9px', opacity: 0.6 }}>▣</span>
        HOME
      </button>

      {HUBS.map((hub) => {
        const cfg = HUB_CONFIG[hub];
        const count = getHubItems(hub).length;
        const isActive = activeHub === hub;
        return (
          <button
            key={hub}
            onClick={() => dispatch({ type: 'SET_HUB', hub })}
            style={tabStyle(isActive, cfg.color, cfg.colorGlow)}
          >
            {/* Neon left bar */}
            <span style={{
              position: 'absolute', left: 0, top: '25%', bottom: '25%',
              width: '3px',
              background: isActive ? cfg.color : 'transparent',
              boxShadow: isActive ? `0 0 6px ${cfg.color}` : 'none',
              transition: 'all 80ms ease',
            }} />
            <span style={{ paddingLeft: '5px' }}>{cfg.label}</span>
            {count > 0 && (
              <span style={{
                fontSize: '10px',
                fontFamily: 'var(--font-body)',
                background: isActive ? cfg.color : 'var(--bg-surface)',
                color: isActive ? 'var(--bg-deep)' : 'var(--text-dim)',
                padding: '0 5px',
                minWidth: '18px',
                textAlign: 'center',
                lineHeight: '17px',
                fontWeight: 'bold',
                boxShadow: isActive ? `0 0 6px ${cfg.colorGlow}` : 'none',
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
