'use client';

import { useState, useEffect } from 'react';
import { BrainItem, HUB_CONFIG, IdeaStatus } from '@/lib/types';
import { useStore } from '@/lib/store';

const IDEA_STATUSES: IdeaStatus[] = ['spark', 'brewing', 'active', 'archived'];

interface ItemDetailProps {
  isMobile: boolean;
}

export function ItemDetail({ isMobile }: ItemDetailProps) {
  const { state, dispatch, updateItem, deleteItem } = useStore();
  const { selectedItemId, items } = state;
  const item = items.find((i) => i.id === selectedItemId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setContent(item.content);
      setTags(item.tags.join(', '));
      setSource(item.source ?? '');
      setDeadline(item.deadline ?? '');
      setIsDirty(false);
    }
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) return null;

  const cfg = HUB_CONFIG[item.hub];
  const dirty = () => setIsDirty(true);

  function handleSave() {
    if (!item) return;
    updateItem({
      ...item,
      title: title.trim() || item.title,
      content,
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      source: source || undefined,
      deadline: deadline || undefined,
    });
    setIsDirty(false);
  }

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        inset: 0,
        top: 'auto',
        height: '85dvh',
        background: 'var(--bg-card)',
        borderTop: `3px solid ${cfg.color}`,
        boxShadow: `0 -8px 40px ${cfg.colorGlow}`,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slide-up 200ms cubic-bezier(0.16,1,0.3,1)',
      }
    : {
        width: 340,
        minWidth: 280,
        background: 'var(--bg-card)',
        borderLeft: `2px solid ${cfg.color}`,
        boxShadow: `-4px 0 20px ${cfg.colorGlow}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
        animation: 'slide-in-right 160ms cubic-bezier(0.16,1,0.3,1)',
      };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,3,15,0.7)', zIndex: 89, backdropFilter: 'blur(2px)' }}
          onClick={() => dispatch({ type: 'SELECT_ITEM', id: null })}
        />
      )}

      <div style={panelStyle}>
        {/* Drag handle (mobile) */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 2px', flexShrink: 0 }}
            onClick={() => dispatch({ type: 'SELECT_ITEM', id: null })}>
            <div style={{ width: 36, height: 4, background: 'var(--border-bright)', borderRadius: 2 }} />
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: '0.55rem 0.75rem',
          borderBottom: '1px solid var(--border-mid)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: cfg.colorDark,
          flexShrink: 0,
        }}>
          <span className="tape-label neon-text-sm" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: cfg.color, padding: '0 0.4rem 0 0.7rem', letterSpacing: '0.1em' }}>
            {cfg.label}
          </span>
          <div style={{ flex: 1 }} />
          {isDirty && (
            <button onClick={handleSave} className="btn-retro btn-retro-sm" style={{ borderColor: cfg.color, color: cfg.color, background: cfg.colorDark, boxShadow: `0 0 8px ${cfg.colorGlow}` }}>
              SAVE
            </button>
          )}
          <button onClick={() => dispatch({ type: 'SELECT_ITEM', id: null })}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '16px', padding: '4px 6px', minHeight: 44 }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {/* Title */}
          <input value={title} onChange={(e) => { setTitle(e.target.value); dirty(); }}
            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${cfg.color}`, padding: '0.25rem 0', fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '0.75rem', boxShadow: 'none' }} />

          {/* Idea status */}
          {item.hub === 'ideas' && (
            <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {IDEA_STATUSES.map((s) => (
                <button key={s} onClick={() => item && updateItem({ ...item, ideaStatus: s })}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.08em', padding: '4px 8px', minHeight: 36,
                    border: `1px solid ${item.ideaStatus === s ? cfg.color : 'var(--border-mid)'}`,
                    background: item.ideaStatus === s ? cfg.colorDark : 'transparent',
                    color: item.ideaStatus === s ? cfg.color : 'var(--text-dim)',
                    boxShadow: item.ideaStatus === s ? `0 0 8px ${cfg.colorGlow}` : 'none',
                    cursor: 'pointer' }}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Contact info */}
          {item.hub === 'contacts' && item.contact && (
            <div style={{ marginBottom: '0.75rem', padding: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
              {[['ROLE', item.contact.role], ['COMPANY', item.contact.company], ['EMAIL', item.contact.email], ['PHONE', item.contact.phone]].map(([label, value]) => value ? (
                <div key={label} style={{ marginBottom: '4px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>{label} </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{value}</span>
                </div>
              ) : null)}
            </div>
          )}

          {/* Source */}
          {item.hub === 'research' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '3px' }}>SOURCE</div>
              <input value={source} onChange={(e) => { setSource(e.target.value); dirty(); }} placeholder="Source / URL"
                style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '11px', color: 'var(--amber-dim)' }} />
            </div>
          )}

          {/* Deadline */}
          {item.hub === 'plans' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '3px' }}>DEADLINE</div>
              <input type="date" value={deadline} onChange={(e) => { setDeadline(e.target.value); dirty(); }}
                style={{ padding: '0.35rem 0.5rem', colorScheme: 'dark', minHeight: 44 }} />
            </div>
          )}

          {/* Checklist */}
          {item.checklist && item.checklist.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '6px' }}>CHECKLIST</div>
              {item.checklist.map((c) => (
                <div key={c.id} className="check-row"
                  onClick={() => dispatch({ type: 'TOGGLE_CHECKLIST', itemId: item.id, checkId: c.id })}>
                  <div className="check-box"
                    style={{ borderColor: c.done ? cfg.color : 'var(--border-bright)', background: c.done ? cfg.colorDark : 'transparent', boxShadow: c.done ? `0 0 6px ${cfg.colorGlow}` : 'none' }}>
                    {c.done && <span style={{ color: cfg.color, fontSize: '10px', lineHeight: 1, textShadow: `0 0 6px ${cfg.color}` }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '13px', color: c.done ? 'var(--text-dim)' : 'var(--text-secondary)', textDecoration: c.done ? 'line-through' : 'none' }}>
                    {c.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '4px' }}>
            {item.hub === 'journal' ? 'ENTRY' : 'NOTES'}
          </div>
          <textarea value={content} onChange={(e) => { setContent(e.target.value); dirty(); }}
            placeholder="Notes, details, context..." rows={8}
            style={{ width: '100%', padding: '0.45rem 0.55rem', resize: 'vertical', background: 'var(--bg-deep)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '13px', border: '1px solid var(--border-mid)', lineHeight: '1.6' }} />

          {/* Tags */}
          <div style={{ marginTop: '0.6rem' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '4px' }}>TAGS</div>
            <input value={tags} onChange={(e) => { setTags(e.target.value); dirty(); }} placeholder="tag1, tag2, tag3"
              style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '11px' }} />
            {item.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '5px' }}>
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-chip" style={{ borderColor: cfg.color, color: cfg.colorDim, boxShadow: `0 0 4px ${cfg.colorGlow}` }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Linked items */}
          {item.linkedIds.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '4px' }}>LINKED</div>
              {item.linkedIds.map((lid) => {
                const linked = items.find((i) => i.id === lid);
                if (!linked) return null;
                const lcfg = HUB_CONFIG[linked.hub];
                return (
                  <div key={lid} onClick={() => dispatch({ type: 'SELECT_ITEM', id: lid })}
                    style={{ cursor: 'pointer', padding: '6px 8px', border: '1px solid var(--border)', marginBottom: '3px', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '6px', minHeight: 44, alignItems: 'center' }}>
                    <span style={{ color: lcfg.color, fontSize: '9px' }}>{lcfg.label}</span>
                    {linked.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.5rem 0.75rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
          paddingBottom: isMobile ? 'max(0.5rem, env(safe-area-inset-bottom))' : '0.5rem',
        }}>
          <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button onClick={() => { if (confirm('Delete this item?')) deleteItem(item.id); }}
            style={{ background: 'none', border: '1px solid var(--border-mid)', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '11px', padding: '4px 10px', minHeight: 44 }}>
            DELETE
          </button>
        </div>
      </div>
    </>
  );
}
