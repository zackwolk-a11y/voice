'use client';

import { VoiceProvider, useVoice } from '@humeai/voice-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

interface VoiceJournalProps {
  accessToken: string;
}

function VoiceControls({ accessToken }: { accessToken: string }) {
  const { status, connect, disconnect, messages } = useVoice();
  const { addItem } = useStore();
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  const isConnected = status.value === 'connected';
  const isConnecting = status.value === 'connecting';

  function handleSaveTranscript() {
    const transcript = messages
      .filter((m) => m.type === 'user_message')
      .map((m) => {
        const msg = m as { message?: { content?: string } };
        return msg.message?.content ?? '';
      })
      .filter(Boolean)
      .join('\n\n');

    if (!transcript) {
      toast.error('Nothing to save yet — speak first.');
      return;
    }

    const now = new Date();
    addItem({
      hub: 'journal',
      title: `Voice · ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      content: transcript,
      tags: ['voice'],
      linkedIds: [],
      pinned: false,
      isVoiceNote: true,
    });
    toast.success('Voice note saved to journal.');
    disconnect();
  }

  function handleConnect() {
    connect({ auth: { type: 'accessToken', value: accessToken }, configId })
      .then(() => {})
      .catch(() => toast.error('Unable to start voice session.'));
  }

  const userMsgCount = messages.filter((m) => m.type === 'user_message').length;

  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isConnected
              ? 'var(--terra)'
              : isConnecting
              ? 'var(--mustard)'
              : 'var(--border-bright)',
          }}
          className={isConnected ? 'pulse-record' : undefined}
        />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            letterSpacing: '0.1em',
            color: isConnected ? 'var(--terra)' : 'var(--text-dim)',
          }}
        >
          {isConnected ? 'RECORDING' : isConnecting ? 'CONNECTING...' : 'STANDBY'}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {userMsgCount > 0 && (
        <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
          {userMsgCount} {userMsgCount === 1 ? 'segment' : 'segments'} captured
        </span>
      )}

      <div style={{ display: 'flex', gap: '6px' }}>
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="btn-retro"
            style={{
              borderColor: 'var(--terra)',
              color: 'var(--terra)',
              background: 'var(--terra-dark)',
              opacity: isConnecting ? 0.6 : 1,
            }}
          >
            {isConnecting ? 'CONNECTING...' : '◉ START'}
          </button>
        ) : (
          <>
            <button
              onClick={handleSaveTranscript}
              className="btn-retro"
              style={{
                borderColor: 'var(--cream-dim)',
                color: 'var(--cream-dim)',
                background: 'var(--cream-dark)',
              }}
            >
              ✓ SAVE NOTE
            </button>
            <button
              onClick={() => disconnect()}
              className="btn-retro"
              style={{
                borderColor: 'var(--border-bright)',
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
            >
              ■ STOP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VoiceJournal({ accessToken }: VoiceJournalProps) {
  return (
    <VoiceProvider onError={(err) => toast.error(err.message)}>
      <VoiceControls accessToken={accessToken} />
    </VoiceProvider>
  );
}
