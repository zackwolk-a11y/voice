'use client';

import { useState, useRef, useEffect } from 'react';
import { HubType, HUB_CONFIG, ChecklistItem } from '@/lib/types';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const HUBS: HubType[] = ['ideas', 'plans', 'research', 'contacts', 'journal'];

interface QuickCaptureProps {
  isMobile: boolean;
}

export function QuickCapture({ isMobile }: QuickCaptureProps) {
  const { state, dispatch, addItem } = useStore();
  const { isQuickCaptureOpen, quickCaptureHub } = state;

  const [hub, setHub] = useState<HubType>(quickCaptureHub);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');
  const [deadline, setDeadline] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isQuickCaptureOpen) {
      setHub(quickCaptureHub);
      setTimeout(() => titleRef.current?.focus(), 80);
    } else {
      resetForm();
    }
  }, [isQuickCaptureOpen, quickCaptureHub]);

  function resetForm() {
    setTitle(''); setContent(''); setTags(''); setSource('');
    setDeadline(''); setContactRole(''); setContactEmail('');
    setContactPhone(''); setContactCompany('');
  }

  function handleClose() { dispatch({ type: 'CLOSE_QUICK_CAPTURE' }); }

  function handleSubmit() {
    if (!title.trim()) { titleRef.current?.focus(); return; }
    const parsedTags = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const base = { hub, title: title.trim(), content: content.trim(), tags: parsedTags, linkedIds: [] as string[], pinned: false };

    if (hub === 'research') {
      addItem({ ...base, source: source.trim() || undefined });
    } else if (hub === 'plans') {
      const checklist: ChecklistItem[] = content.split('\n').filter(Boolean).map((line) => ({
        id: crypto.randomUUID(),
        text: line.replace(/^[-*•]\s*/, '').trim(),
        done: false,
      }));
      addItem({ ...base, content: '', checklist: checklist.length ? checklist : undefined, deadline: deadline || undefined });
    } else if (hub === 'contacts') {
      addItem({ ...base, contact: { role: contactRole.trim(), company: contactCompany.trim(), email: contactEmail.trim(), phone: contactPhone.trim() } });
    } else if (hub === 'ideas') {
      addItem({ ...base, ideaStatus: 'spark' });
    } else {
      addItem(base);
    }

    toast.success(`Filed to ${HUB_CONFIG[hub].label}`);
    handleClose();
  }

  if (!isQuickCaptureOpen) return null;

  const cfg = HUB_CONFIG[hub];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className={`sheet-panel retro-card ${isMobile ? 'slide-up' : 'fade-up'}`}
        style={{
          borderTop: `3px solid ${cfg.color}`,
          boxShadow: `0 0 30px ${cfg.colorGlow}, 0 0 60px ${cfg.colorGlow}`,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: isMobile ? '92dvh' : '88vh',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClose();
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
      >
        {/* Drag handle on mobile */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
            <div style={{ width: 36, height: 4, background: 'var(--border-bright)', borderRadius: 2 }} />
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: '0.6rem 0.75rem',
          borderBottom: '1px solid var(--border-mid)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          flexShrink: 0,
        }}>
          <span className="tape-label neon-text-sm" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: cfg.color }}>
            + QUICK CAPTURE
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '18px', padding: '4px 6px', minHeight: 44 }}>
            ✕
          </button>
        </div>

        {/* Hub selector */}
        <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '5px', flexWrap: 'wrap', flexShrink: 0 }}>
          {HUBS.map((h) => {
            const hcfg = HUB_CONFIG[h];
            const active = h === hub;
            return (
              <button key={h} onClick={() => setHub(h)} style={{
                fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.08em',
                padding: '4px 10px', minHeight: 36,
                border: `1px solid ${active ? hcfg.color : 'var(--border-mid)'}`,
                background: active ? hcfg.colorDark : 'transparent',
                color: active ? hcfg.color : 'var(--text-dim)',
                cursor: 'pointer',
                boxShadow: active ? `0 0 8px ${hcfg.colorGlow}` : 'none',
                transition: 'all 80ms ease',
              }}>
                {hcfg.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={cfg.quickPrompt}
            style={{ width: '100%', padding: '0.55rem 0.65rem', fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.04em', background: 'var(--bg-deep)', border: `1px solid ${cfg.color}`, color: 'var(--text-primary)', boxShadow: `0 0 8px ${cfg.colorGlow}` }}
          />

          {hub === 'contacts' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {[
                ['Role / title', contactRole, setContactRole],
                ['Company / org', contactCompany, setContactCompany],
                ['Email', contactEmail, setContactEmail],
                ['Phone', contactPhone, setContactPhone],
              ].map(([ph, val, setter]) => (
                <input key={ph as string} value={val as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} placeholder={ph as string} style={{ padding: '0.45rem 0.55rem', width: '100%' }} />
              ))}
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Notes on this person..." rows={2}
                style={{ gridColumn: '1 / -1', padding: '0.45rem 0.55rem', width: '100%', resize: 'vertical', background: 'var(--bg-deep)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', border: '1px solid var(--border-mid)' }} />
            </div>
          ) : hub === 'plans' ? (
            <>
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder={'Steps / checklist items (one per line):\n- First step\n- Second step'}
                rows={5} style={{ width: '100%', padding: '0.45rem 0.55rem', resize: 'vertical', background: 'var(--bg-deep)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', border: '1px solid var(--border-mid)' }} />
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                style={{ padding: '0.45rem 0.55rem', width: '100%', colorScheme: 'dark' }} />
            </>
          ) : hub === 'research' ? (
            <>
              <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source / URL / reference"
                style={{ padding: '0.45rem 0.55rem', width: '100%' }} />
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Notes, quotes, key takeaways..." rows={4}
                style={{ width: '100%', padding: '0.45rem 0.55rem', resize: 'vertical', background: 'var(--bg-deep)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', border: '1px solid var(--border-mid)' }} />
            </>
          ) : (
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder={hub === 'journal' ? 'Stream of consciousness...' : 'Details, notes, context...'}
              rows={5} style={{ width: '100%', padding: '0.45rem 0.55rem', resize: 'vertical', background: 'var(--bg-deep)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', border: '1px solid var(--border-mid)' }} />
          )}

          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)"
            style={{ padding: '0.4rem 0.55rem', width: '100%', color: 'var(--text-secondary)' }} />
        </div>

        {/* Footer */}
        <div style={{ padding: '0.6rem 0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: isMobile ? 'max(0.6rem, env(safe-area-inset-bottom))' : '0.6rem' }}>
          {!isMobile && <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>⌘↵ save · ESC close</span>}
          <div style={{ flex: 1 }} />
          <button onClick={handleClose} style={{ background: 'none', border: '1px solid var(--border-mid)', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '12px', padding: '0.4rem 0.8rem', marginRight: '8px', minHeight: 44 }}>
            CANCEL
          </button>
          <button onClick={handleSubmit} className="btn-retro" style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, boxShadow: `0 0 10px ${cfg.colorGlow}` }}>
            FILE IT
          </button>
        </div>
      </div>
    </div>
  );
}
