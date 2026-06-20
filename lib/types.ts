export type HubType = 'ideas' | 'plans' | 'research' | 'contacts' | 'journal';
export type IdeaStatus = 'spark' | 'brewing' | 'active' | 'archived';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ContactMeta {
  role: string;
  company: string;
  email: string;
  phone: string;
}

export interface BrainItem {
  id: string;
  hub: HubType;
  title: string;
  content: string;
  tags: string[];
  linkedIds: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  ideaStatus?: IdeaStatus;
  checklist?: ChecklistItem[];
  deadline?: string;
  source?: string;
  contact?: ContactMeta;
  isVoiceNote?: boolean;
  mood?: string;
}

// 1980s synthwave / neon palette
export const HUB_CONFIG = {
  ideas: {
    label: 'IDEAS',
    color: '#FF2B8A',      // hot pink
    colorDark: '#1F0515',
    colorDim: '#C0206A',
    colorGlow: 'rgba(255,43,138,0.35)',
    emptyState: "The tank's empty. What's rattling around up there?",
    quickPrompt: "What's the spark?",
  },
  plans: {
    label: 'PLANS',
    color: '#00E5FF',      // electric cyan
    colorDark: '#002830',
    colorDim: '#009BB8',
    colorGlow: 'rgba(0,229,255,0.35)',
    emptyState: 'Nothing in motion yet. Time to map something out.',
    quickPrompt: 'What needs to happen?',
  },
  research: {
    label: 'RESEARCH',
    color: '#FFB800',      // neon amber
    colorDark: '#1E1500',
    colorDim: '#C08800',
    colorGlow: 'rgba(255,184,0,0.35)',
    emptyState: 'No rabbit holes filed. Drop a deep-dive topic in here.',
    quickPrompt: 'What are you investigating?',
  },
  contacts: {
    label: 'CONTACTS',
    color: '#00FF9F',      // neon green
    colorDark: '#001810',
    colorDim: '#00BB75',
    colorGlow: 'rgba(0,255,159,0.35)',
    emptyState: 'Rolodex empty. Who should you be talking to?',
    quickPrompt: 'Who are they?',
  },
  journal: {
    label: 'JOURNAL',
    color: '#BF5FFF',      // electric purple
    colorDark: '#160828',
    colorDim: '#8A3FCC',
    colorGlow: 'rgba(191,95,255,0.35)',
    emptyState: 'No entries yet. Just start typing. Or talking.',
    quickPrompt: "What's on your mind?",
  },
} as const;
