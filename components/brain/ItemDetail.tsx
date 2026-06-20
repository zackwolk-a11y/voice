'use client';

import { useState, useEffect } from 'react';
import { BrainItem, HUB_CONFIG, IdeaStatus } from '@/lib/types';
import { useStore } from '@/lib/store';

const IDEA_STATUSES: IdeaStatus[] = ['spark', 'brewing', 'active', 'archived'];

export function ItemDetail() {
  const { state, dispatch, updateItem, deleteItem, getHubItems } = useStore();
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
  }, [item?.id]);

  if (!item) return null;

  const cfg = HUB_CONFIG[item.hub];

  function markDirty() {
    setIsDirty(true);
  }

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

  function handleChecklistToggle(checkId: string) {
    if (!item) return;
    dispatch({ type: 'TOGGLE_CHECKLIST', itemId: item.id, checkId });
  }

  function handleStatusChange(s: IdeaStatus) {
    if (!item) return;
    updateItem({ ...item, ideaStatus: s });
  }

  return (
    <div
      className="slide-in-right"
      style={{
        width: '340px',
        minWidth: '280px',
        background: 'var(--bg-card)',
        borderLeft: `2px solid ${cfg.color}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.6rem 0.75rem',
          borderBottom: '1px solid var(--border-mid)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: cfg.colorDark,
        }}
      >
        <span
          className="tape-label"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            letterSpacing: '0.1em',
            color: cfg.color,
            padding: '0 0.4rem 0 0.7rem',
          }}
        >
          {cfg.label}
        </span>
        <span style={{ flex: 1 }} />
        {isDirty && (
          <button
            onClick={handleSave}
            className="btn-retro"
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderColor: cfg.color,
              color: cfg.color,
              background: cfg.colorDark,
            }}
          >
            SAVE
          </button>
        )}
        <button
          onClick={() => dispatch({ type: 'SELECT_ITEM', id: null })}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0 2px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem' }}>
        {/* Title */}
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); markDirty(); }}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border-mid)',
            padding: '0.3rem 0',
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            letterSpacing: '0.05em',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
          }}
        />

        {/* Idea status selector */}
        {item.hub === 'ideas' && (
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {IDEA_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  padding: '2px 7px',
                  border: `1px solid ${item.ideaStatus === s ? cfg.color : 'var(--border-mid)'}`,
                  background: item.ideaStatus === s ? cfg.colorDark : 'transparent',
                  color: item.ideaStatus === s ? cfg.color : 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Contact fields */}
        {item.hub === 'contacts' && item.contact && (
          <div style={{ marginBottom: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {[
              ['Role', item.contact.role],
              ['Company', item.contact.company],
              ['Email', item.contact.email],
              ['Phone', item.contact.phone],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '2px' }}>
                  {label?.toUpperCase()}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {value || '—'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Source */}
        {item.hub === 'research' && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '3px' }}>
              SOURCE
            </div>
            <input
              value={source}
              onChange={(e) => { setSource(e.target.value); markDirty(); }}
              placeholder="Source / URL"
              style={{
                width: '100%',
                padding: '0.3rem 0.5rem',
                fontSize: '11px',
                color: 'var(--terra-dim)',
              }}
            />
          </div>
        )}

        {/* Deadline */}
        {item.hub === 'plans' && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '3px' }}>
              DEADLINE
            </div>
            <input
              type="date"
              value={deadline}
              onChange={(e) => { setDeadline(e.target.value); markDirty(); }}
              style={{ padding: '0.3rem 0.5rem', fontSize: '11px', colorScheme: 'dark' }}
            />
          </div>
        )}

        {/* Checklist */}
        {item.checklist && item.checklist.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              CHECKLIST
            </div>
            {item.checklist.map((c) => (
              <div
                key={c.id}
                className="check-row"
                onClick={() => handleChecklistToggle(c.id)}
              >
                <div
                  className="check-box"
                  style={{
                    borderColor: c.done ? cfg.color : 'var(--border-bright)',
                    background: c.done ? cfg.colorDark : 'transparent',
                  }}
                >
                  {c.done && (
                    <span style={{ color: cfg.color, fontSize: '9px', lineHeight: 1 }}>✓</span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: c.done ? 'var(--text-dim)' : 'var(--text-secondary)',
                    textDecoration: c.done ? 'line-through' : 'none',
                  }}
                >
                  {c.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '4px' }}>
          {item.hub === 'journal' ? 'ENTRY' : 'NOTES'}
        </div>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); markDirty(); }}
          placeholder="Notes, details, context..."
          rows={8}
          style={{
            width: '100%',
            padding: '0.4rem 0.5rem',
            resize: 'vertical',
            background: 'var(--bg-deep)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            border: '1px solid var(--border-mid)',
            lineHeight: '1.6',
          }}
        />

        {/* Tags */}
        <div style={{ marginTop: '0.6rem' }}>
          <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '4px' }}>
            TAGS
          </div>
          <input
            value={tags}
            onChange={(e) => { setTags(e.target.value); markDirty(); }}
            placeholder="tag1, tag2, tag3"
            style={{ width: '100%', padding: '0.3rem 0.5rem', fontSize: '11px' }}
          />
          {item.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '5px' }}>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag-chip"
                  style={{ borderColor: cfg.color, color: cfg.colorDim }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Linked items */}
        {item.linkedIds.length > 0 && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '4px' }}>
              LINKED
            </div>
            {item.linkedIds.map((lid) => {
              const linked = items.find((i) => i.id === lid);
              if (!linked) return null;
              return (
                <div
                  key={lid}
                  onClick={() => dispatch({ type: 'SELECT_ITEM', id: lid })}
                  style={{
                    cursor: 'pointer',
                    padding: '3px 6px',
                    border: '1px solid var(--border)',
                    marginBottom: '3px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  <span style={{ color: HUB_CONFIG[linked.hub].color, fontSize: '9px' }}>
                    {HUB_CONFIG[linked.hub].label}
                  </span>
                  {linked.title}
                </div>
              );
            })}
          </div>
        )}
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
        <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <button
          onClick={() => {
            if (confirm('Delete this item?')) {
              deleteItem(item.id);
            }
          }}
          style={{
            background: 'none',
            border: '1px solid var(--border-mid)',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            padding: '2px 7px',
          }}
        >
          DELETE
        </button>
      </div>
    </div>
  );
}
