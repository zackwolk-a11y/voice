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
    ? allItems.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase()))
    : allItems;

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
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
      {/* Header */}
      <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-mid)', background: cfg.colorDark, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="tape-label neon-text" style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: cfg.color }}>
            JOURNAL
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            {accessToken && (
              <button onClick={() => setShowVoice(!showVoice)}
                className="btn-retro btn-retro-sm"
                style={{
                  borderColor: showVoice ? 'var(--pink)' : 'var(--border-mid)',
                  color: showVoice ? 'var(--pink)' : 'var(--text-secondary)',
                  background: showVoice ? 'var(--pink-dark)' : 'transparent',
                  boxShadow: showVoice ? '0 0 8px var(--pink-glow)' : 'none',
                }}>
                {showVoice ? <><span className="pulse-record" style={{ color: 'var(--pink)' }}>◉</span> VOICE</> : <>◎ VOICE</>}
              </button>
            )}
            <button onClick={() => dispatch({ type: 'OPEN_QUICK_CAPTURE', hub: 'journal' })}
              className="btn-retro btn-retro-sm"
              style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, boxShadow: `0 0 8px ${cfg.colorGlow}` }}>
              + JOT
            </button>
          </div>
        </div>
      </div>

      {/* Voice interface */}
      {showVoice && accessToken && (
        <div style={{ borderBottom: '1px solid var(--border-mid)', background: 'var(--bg-deep)', flexShrink: 0 }}>
          <VoiceJournal accessToken={accessToken} />
        </div>
      )}

      {/* Quick jot */}
      <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          {MOODS.map((mood) => (
            <button key={mood} onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)} style={{
              fontFamily: 'var(--font-body)', fontSize: '10px', padding: '3px 7px', minHeight: 30,
              border: `1px solid ${selectedMood === mood ? cfg.color : 'var(--border)'}`,
              background: selectedMood === mood ? cfg.colorDark : 'transparent',
              color: selectedMood === mood ? cfg.color : 'var(--text-dim)',
              cursor: 'pointer',
              boxShadow: selectedMood === mood ? `0 0 5px ${cfg.colorGlow}` : 'none',
            }}>
              {mood}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <textarea value={quickText} onChange={(e) => setQuickText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleQuickJot(); }}
            placeholder="Quick jot — just start. ⌘↵ to file." rows={2}
            style={{ flex: 1, padding: '0.45rem 0.6rem', background: 'var(--bg-deep)', border: '1px solid var(--border-mid)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', resize: 'vertical', lineHeight: '1.5' }} />
          <button onClick={handleQuickJot} className="btn-retro btn-retro-sm"
            style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, alignSelf: 'flex-end', boxShadow: `0 0 8px ${cfg.colorGlow}` }}>
            JOT ↵
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search entries..."
          style={{ width: '100%', padding: '0.35rem 0.55rem', background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
      </div>

      {/* Entries grouped by date */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.65rem 0.75rem' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em' }}>
            {search ? 'No matches.' : cfg.emptyState}
          </div>
        ) : (
          Object.entries(grouped).map(([date, dateItems]) => (
            <div key={date} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <div style={{ height: '1px', width: '12px', background: 'var(--border-mid)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.12em', color: cfg.color, whiteSpace: 'nowrap', textShadow: `0 0 6px ${cfg.color}` }}>
                  {date}
                </span>
                <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '9px', color: 'var(--text-dim)', flexShrink: 0 }}>
                  {dateItems.length} {dateItems.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {dateItems.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
