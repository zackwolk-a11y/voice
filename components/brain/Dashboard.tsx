'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
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

export default function Dashboard({ accessToken }: DashboardProps) {
  const { state, dispatch } = useStore();
  const { activeHub, selectedItemId, isQuickCaptureOpen } = state;

  // Global keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // ⌘K = open quick capture
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isQuickCaptureOpen) {
          dispatch({ type: 'CLOSE_QUICK_CAPTURE' });
        } else {
          dispatch({ type: 'OPEN_QUICK_CAPTURE' });
        }
      }
      // ESC = close detail / quick capture
      if (e.key === 'Escape') {
        if (isQuickCaptureOpen) {
          dispatch({ type: 'CLOSE_QUICK_CAPTURE' });
        } else if (selectedItemId) {
          dispatch({ type: 'SELECT_ITEM', id: null });
        }
      }
      // Number keys 1-5 to switch hubs, 0 for home
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const hubMap: Record<string, 'home' | 'ideas' | 'plans' | 'research' | 'contacts' | 'journal'> = {
          '0': 'home',
          '1': 'ideas',
          '2': 'plans',
          '3': 'research',
          '4': 'contacts',
          '5': 'journal',
        };
        const target = hubMap[e.key];
        if (target && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
          dispatch({ type: 'SET_HUB', hub: target });
        }
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
      case 'home':
        return <Overview />;
      case 'ideas':
        return <IdeaHub />;
      case 'plans':
        return <PlanHub />;
      case 'research':
        return <ResearchHub />;
      case 'contacts':
        return <ContactHub />;
      case 'journal':
        return <JournalHub accessToken={accessToken} />;
      default:
        return <Overview />;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
    >
      {/* App header */}
      <header
        style={{
          background: 'var(--bg-deep)',
          borderBottom: '2px solid var(--border-mid)',
          padding: '0 1rem',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo / title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          {/* Tape edge decoration */}
          <div
            style={{
              width: '6px',
              height: '30px',
              background: 'repeating-linear-gradient(to bottom, var(--mustard) 0px, var(--mustard) 4px, var(--mustard-dark) 4px, var(--mustard-dark) 8px)',
              marginRight: '8px',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                letterSpacing: '0.12em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              ZACK&apos;S 2ND BRAIN
            </div>
            <div
              style={{
                fontSize: '9px',
                color: 'var(--text-dim)',
                letterSpacing: '0.15em',
                fontFamily: 'var(--font-body)',
                marginTop: '1px',
              }}
            >
              PERSONAL KNOWLEDGE SYSTEM v1.0
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Keyboard shortcut hint */}
        <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'none', gap: '4px' }}
          className="md:flex">
          <kbd style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-mid)', padding: '1px 4px', fontSize: '9px' }}>⌘K</kbd>
          quick capture
        </span>

        {/* Quick capture button */}
        <button
          onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE' })}
          className="btn-retro"
          style={{
            borderColor: 'var(--mustard)',
            color: 'var(--mustard)',
            background: 'var(--mustard-dark)',
            fontSize: '12px',
            padding: '0.25rem 0.6rem',
          }}
        >
          + CAPTURE
        </button>
      </header>

      {/* Hub navigation */}
      <HubNav />

      {/* Main content area */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Hub content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderHub()}
        </div>

        {/* Item detail panel */}
        {selectedItemId && activeHub !== 'contacts' && (
          <ItemDetail />
        )}
      </div>

      {/* Quick capture modal */}
      <QuickCapture />
    </div>
  );
}
