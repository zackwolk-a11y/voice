'use client';

import { HubType, HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';

const HUBS: HubType[] = ['ideas', 'plans', 'research', 'contacts', 'journal'];

export function HubNav() {
  const { state, dispatch, getHubItems } = useStore();
  const { activeHub } = state;

  return (
    <nav
      style={{
        background: 'var(--bg-deep)',
        borderBottom: '2px solid var(--border-mid)',
        display: 'flex',
        alignItems: 'stretch',
        overflowX: 'auto',
      }}
    >
      {/* HOME tab */}
      <button
        onClick={() => dispatch({ type: 'SET_HUB', hub: 'home' })}
        style={{
          padding: '0.5rem 1rem',
          fontFamily: 'var(--font-display)',
          fontSize: '15px',
          letterSpacing: '0.1em',
          color: activeHub === 'home' ? 'var(--text-primary)' : 'var(--text-dim)',
          background: activeHub === 'home' ? 'var(--bg-card)' : 'transparent',
          border: 'none',
          borderRight: '1px solid var(--border)',
          borderBottom: activeHub === 'home' ? '2px solid var(--mustard)' : '2px solid transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          whiteSpace: 'nowrap',
          marginBottom: '-2px',
          transition: 'all 80ms ease',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '10px', opacity: 0.7 }}>▣</span>
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
            style={{
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              letterSpacing: '0.1em',
              color: isActive ? cfg.color : 'var(--text-dim)',
              background: isActive ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderRight: '1px solid var(--border)',
              borderBottom: isActive
                ? `2px solid ${cfg.color}`
                : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              marginBottom: '-2px',
              transition: 'all 80ms ease',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Tape-spine accent */}
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '20%',
                bottom: '20%',
                width: '3px',
                background: isActive ? cfg.color : 'transparent',
                transition: 'background 80ms ease',
              }}
            />
            <span style={{ paddingLeft: '4px' }}>{cfg.label}</span>
            {count > 0 && (
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-body)',
                  background: isActive ? cfg.color : 'var(--bg-surface)',
                  color: isActive ? 'var(--bg-deep)' : 'var(--text-dim)',
                  padding: '0 4px',
                  borderRadius: '2px',
                  minWidth: '18px',
                  textAlign: 'center',
                  lineHeight: '16px',
                  fontWeight: 'bold',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
