'use client';

import { useState } from 'react';
import { HUB_CONFIG } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ItemCard } from './ItemCard';
import dynamic from 'next/dynamic';

const VoiceJournal = dynamic(() => import('./VoiceJournal'), { ssr: false });

interface JournalHubProps {
  accessToken: string | null;
}

const MOODS = ['⚡ wired', '🔥 fired up', '🌊 flowing', '😤 frustrated', '🧩 puzzled', '😌 calm'];

export function JournalHub({ accessToken }: JournalHubProps) {
  const { getHubItems, addItem, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [showVoice, setShowVoice] = useState(false);
  const [quickText, setQuickText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const cfg = HUB_CONFIG.journal;
  const allItems = getHubItems('journal');

  const items = search
    ? allItems.filter(
        (i) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.content.toLowerCase().includes(search.toLowerCase())
      )
    : allItems;

  // Group items by date
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  function handleQuickJot() {
    if (!quickText.trim()) return;
    const now = new Date();
    addItem({
      hub: 'journal',
      title: `Jot · ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      content: quickText.trim(),
      tags: [],
      linkedIds: [],
      pinned: false,
      mood: selectedMood || undefined,
    });
    setQuickText('');
    setSelectedMood('');
  }

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
            JOURNAL
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', paddingLeft: '8px', marginTop: '1px' }}>
            Daily logs, streams & voice notes
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '6px' }}>
          {accessToken && (
            <button
              onClick={() => setShowVoice(!showVoice)}
              className="btn-retro"
              style={{
                borderColor: showVoice ? cfg.color : 'var(--border-mid)',
                color: showVoice ? cfg.color : 'var(--text-secondary)',
                background: showVoice ? cfg.colorDark : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {showVoice ? (
                <>
                  <span className="pulse-record" style={{ color: '#C15B38' }}>◉</span> VOICE ON
                </>
              ) : (
                <> ◎ VOICE</>
              )}
            </button>
          )}
          <button
            onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'journal' })}
            className="btn-retro"
            style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark }}
          >
            + JOT
          </button>
        </div>
      </div>

      {/* Voice interface */}
      {showVoice && accessToken && (
        <div
          style={{
            borderBottom: '1px solid var(--border-mid)',
            background: 'var(--bg-deep)',
          }}
        >
          <VoiceJournal accessToken={accessToken} />
        </div>
      )}

      {/* Quick jot inline */}
      <div
        style={{
          padding: '0.6rem 1rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-raised)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                padding: '2px 6px',
                border: `1px solid ${selectedMood === mood ? cfg.color : 'var(--border)'}`,
                background: selectedMood === mood ? cfg.colorDark : 'transparent',
                color: selectedMood === mood ? cfg.color : 'var(--text-dim)',
                cursor: 'pointer',
              }}
            >
              {mood}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <textarea
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) handleQuickJot();
            }}
            placeholder="Quick jot — stream it out. ⌘↵ to file."
            rows={2}
            style={{
              flex: 1,
              padding: '0.4rem 0.6rem',
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-mid)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              resize: 'vertical',
              lineHeight: '1.5',
            }}
          />
          <button
            onClick={handleQuickJot}
            className="btn-retro"
            style={{
              borderColor: cfg.color,
              color: cfg.color,
              background: cfg.colorDark,
              alignSelf: 'flex-end',
              whiteSpace: 'nowrap',
            }}
          >
            JOT ↵
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.4rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entries..."
          style={{
            width: '100%',
            padding: '0.3rem 0.5rem',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
          }}
        />
      </div>

      {/* Entries - grouped by date */}
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
          Object.entries(grouped).map(([date, dateItems]) => (
            <div key={date} style={{ marginBottom: '1.25rem' }}>
              {/* Date divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ height: '1px', flex: 0, width: '16px', background: 'var(--border-mid)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    color: cfg.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {date}
                </span>
                <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                  {dateItems.length} {dateItems.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {dateItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
