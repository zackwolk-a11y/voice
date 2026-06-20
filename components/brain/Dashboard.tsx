'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { useIsMobile } from '@/lib/useIsMobile';
import { HubType, HUB_CONFIG } from '@/lib/types';
import { HubNav } from './HubNav';
import { QuickCapture } from './QuickCapture';
import { ItemDetail } from './ItemDetail';
import { Overview } from './Overview';
import { IdeaHub } from './IdeaHub';
import { PlanHub } from './PlanHub';
import { ResearchHub } from './ResearchHub';
import { ContactHub } from './ContactHub';
import { JournalHub } from './JournalHub';

interface DashboardProps {
  accessToken: string | null;
}

const HUBS: HubType[] = ['ideas', 'plans', 'research', 'contacts', 'journal'];

// Hub icon glyphs — retro terminal style
const HUB_ICONS: Record<string, string> = {
  home:     '▣',
  ideas:    '◆',
  plans:    '◉',
  research: '◈',
  contacts: '◎',
  journal:  '▶',
};

export default function Dashboard({ accessToken }: DashboardProps) {
  const { state, dispatch } = useStore();
  const { activeHub, selectedItemId, isQuickCaptureOpen } = state;
  const isMobile = useIsMobile();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: isQuickCaptureOpen ? 'CLOSE_QUICK_CAPTURE' : 'OPEN_QUICK_CAPTURE' });
        return;
      }
      if (e.key === 'Escape') {
        if (isQuickCaptureOpen) dispatch({ type: 'CLOSE_QUICK_CAPTURE' });
        else if (selectedItemId) dispatch({ type: 'SELECT_ITEM', id: null });
        return;
      }
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        const map: Record<string, 'home' | HubType> = {
          '0': 'home', '1': 'ideas', '2': 'plans',
          '3': 'research', '4': 'contacts', '5': 'journal',
        };
        if (map[e.key]) dispatch({ type: 'SET_HUB', hub: map[e.key] });
      }
    },
    [isQuickCaptureOpen, selectedItemId, dispatch]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  function renderHub() {
    switch (activeHub) {
      case 'ideas':    return <IdeaHub />;
      case 'plans':    return <PlanHub />;
      case 'research': return <ResearchHub />;
      case 'contacts': return <ContactHub />;
      case 'journal':  return <JournalHub accessToken={accessToken} />;
      default:         return <Overview />;
    }
  }

  return (
    <div
      className="crt-frame scan-lines"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── App Header ─────────────────────────────────────── */}
      <header
        style={{
          background: 'var(--bg-deep)',
          borderBottom: '1px solid var(--border-mid)',
          paddingTop: 'env(safe-area-inset-top)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: 'max(0.5rem, env(safe-area-inset-top)) 0.75rem 0.5rem',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Animated neon tape-stripe */}
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          {['var(--pink)', 'var(--cyan)', 'var(--purple)'].map((c, i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: '26px',
                background: c,
                boxShadow: `0 0 6px ${c}, 0 0 12px ${c}`,
                opacity: 0.9,
              }}
            />
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="neon-text"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '18px' : '22px',
              letterSpacing: '0.1em',
              color: 'var(--text-primary)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            ZACK&apos;S 2ND BRAIN
          </div>
          {!isMobile && (
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.15em', marginTop: '1px' }}>
              PERSONAL KNOWLEDGE SYSTEM
            </div>
          )}
        </div>

        <button
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE' })}
          className="btn-retro btn-retro-sm"
          style={{ borderColor: 'var(--pink)', color: 'var(--pink)', background: 'var(--pink-dark)' }}
        >
          + {isMobile ? '' : 'CAPTURE'}
        </button>
      </header>

      {/* ── Desktop Hub Nav (hidden on mobile) ─────────────── */}
      {!isMobile && <HubNav />}

      {/* ── Content area ───────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {renderHub()}
        </div>

        {/* Desktop item detail side panel */}
        {!isMobile && selectedItemId && activeHub !== 'contacts' && (
          <ItemDetail isMobile={false} />
        )}
      </div>

      {/* ── Mobile bottom navigation ────────────────────────── */}
      {isMobile && (
        <nav className="bottom-nav">
          {/* Home */}
          <button
            className={`bottom-nav-btn ${activeHub === 'home' ? 'active' : ''}`}
            style={{ '--active-color': 'var(--text-primary)' } as React.CSSProperties}
            onClick={() => dispatch({ type: 'SET_HUB', hub: 'home' })}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>▣</span>
            <span>HOME</span>
          </button>

          {HUBS.map((hub) => {
            const cfg = HUB_CONFIG[hub];
            const isActive = activeHub === hub;
            return (
              <button
                key={hub}
                className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
                style={{ '--active-color': cfg.color } as React.CSSProperties}
                onClick={() => dispatch({ type: 'SET_HUB', hub })}
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>
                  {HUB_ICONS[hub]}
                </span>
                <span style={{ fontSize: '8px' }}>{cfg.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Mobile item detail (bottom sheet) */}
      {isMobile && selectedItemId && activeHub !== 'contacts' && (
        <ItemDetail isMobile={true} />
      )}

      {/* Quick capture modal / bottom sheet */}
      <QuickCapture isMobile={isMobile} />
    </div>
  );
}
