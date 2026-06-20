'use client';

import { useState, useRef, useEffect } from 'react';
import { HubType, HUB_CONFIG, ChecklistItem } from '@/lib/types';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const HUBS: HubType[] = ['ideas', 'plans', 'research', 'contacts', 'journal'];

export function QuickCapture() {
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
      setTimeout(() => titleRef.current?.focus(), 50);
    } else {
      resetForm();
    }
  }, [isQuickCaptureOpen, quickCaptureHub]);

  function resetForm() {
    setTitle('');
    setContent('');
    setTags('');
    setSource('');
    setDeadline('');
    setContactRole('');
    setContactEmail('');
    setContactPhone('');
    setContactCompany('');
  }

  function handleClose() {
    dispatch({ type: 'CLOSE_QUICK_CAPTURE' });
  }

  function handleSubmit() {
    if (!title.trim()) {
      titleRef.current?.focus();
      return;
    }

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const baseItem = {
      hub,
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags,
      linkedIds: [] as string[],
      pinned: false,
    };

    if (hub === 'research') {
      addItem({ ...baseItem, source: source.trim() });
    } else if (hub === 'plans') {
      const checklist: ChecklistItem[] = content
        .split('\n')
        .filter(Boolean)
        .map((line) => ({
          id: crypto.randomUUID(),
          text: line.replace(/^[-*•]\s*/, '').trim(),
          done: false,
        }));
      addItem({
        ...baseItem,
        content: '',
        checklist: checklist.length ? checklist : undefined,
        deadline: deadline || undefined,
      });
    } else if (hub === 'contacts') {
      addItem({
        ...baseItem,
        contact: {
          role: contactRole.trim(),
          company: contactCompany.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim(),
        },
      });
    } else if (hub === 'ideas') {
      addItem({ ...baseItem, ideaStatus: 'spark' });
    } else {
      addItem(baseItem);
    }

    toast.success(`Filed to ${HUB_CONFIG[hub].label}`, { duration: 1500 });
    handleClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  }

  if (!isQuickCaptureOpen) return null;

  const cfg = HUB_CONFIG[hub];

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown}>
      <div
        className="retro-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          borderTop: `3px solid ${cfg.color}`,
          animation: 'fade-up 120ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.6rem 0.75rem',
            borderBottom: '1px solid var(--border-mid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              letterSpacing: '0.1em',
              color: cfg.color,
            }}
          >
            + QUICK CAPTURE
          </span>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Hub selector */}
        <div
          style={{
            padding: '0.5rem 0.75rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          {HUBS.map((h) => {
            const hcfg = HUB_CONFIG[h];
            const active = h === hub;
            return (
              <button
                key={h}
                onClick={() => setHub(h)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  padding: '2px 8px',
                  border: `1px solid ${active ? hcfg.color : 'var(--border-mid)'}`,
                  background: active ? hcfg.colorDark : 'transparent',
                  color: active ? hcfg.color : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 80ms ease',
                }}
              >
                {hcfg.label}
              </button>
            );
          })}
        </div>

        {/* Form body */}
        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={cfg.quickPrompt}
            style={{
              width: '100%',
              padding: '0.5rem 0.6rem',
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-mid)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              letterSpacing: '0.05em',
            }}
          />

          {hub === 'contacts' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <input
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                placeholder="Role / title"
                style={{ padding: '0.4rem 0.6rem', width: '100%' }}
              />
              <input
                value={contactCompany}
                onChange={(e) => setContactCompany(e.target.value)}
                placeholder="Company / org"
                style={{ padding: '0.4rem 0.6rem', width: '100%' }}
              />
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email"
                type="email"
                style={{ padding: '0.4rem 0.6rem', width: '100%' }}
              />
              <input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone"
                style={{ padding: '0.4rem 0.6rem', width: '100%' }}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Notes on this person..."
                rows={2}
                style={{
                  gridColumn: '1 / -1',
                  padding: '0.4rem 0.6rem',
                  width: '100%',
                  resize: 'vertical',
                  background: 'var(--bg-deep)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  border: '1px solid var(--border-mid)',
                }}
              />
            </div>
          ) : hub === 'plans' ? (
            <>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={'Steps / checklist items (one per line):\n- First step\n- Second step'}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.6rem',
                  resize: 'vertical',
                  background: 'var(--bg-deep)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  border: '1px solid var(--border-mid)',
                }}
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Deadline (optional)"
                style={{ padding: '0.4rem 0.6rem', width: '100%', colorScheme: 'dark' }}
              />
            </>
          ) : hub === 'research' ? (
            <>
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source / URL / reference"
                style={{ padding: '0.4rem 0.6rem', width: '100%' }}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Notes, quotes, key takeaways..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.6rem',
                  resize: 'vertical',
                  background: 'var(--bg-deep)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  border: '1px solid var(--border-mid)',
                }}
              />
            </>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={hub === 'journal' ? 'Stream of consciousness...' : 'Details, notes, context...'}
              rows={4}
              style={{
                width: '100%',
                padding: '0.4rem 0.6rem',
                resize: 'vertical',
                background: 'var(--bg-deep)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                border: '1px solid var(--border-mid)',
              }}
            />
          )}

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            style={{ padding: '0.4rem 0.6rem', width: '100%', fontSize: '11px' }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.5rem 0.75rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>
            ⌘↵ to save · ESC to close
          </span>
          <button
            onClick={handleSubmit}
            className="btn-retro"
            style={{
              borderColor: cfg.color,
              color: cfg.color,
              background: cfg.colorDark,
            }}
          >
            FILE IT
          </button>
        </div>
      </div>
    </div>
  );
}
