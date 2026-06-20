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

export const HUB_CONFIG = {
  ideas: {
    label: 'IDEAS',
    color: '#D4A017',
    colorDark: '#3D2E06',
    colorDim: '#9A7510',
    emptyState: "The tank's empty. What's rattling around up there?",
    quickPrompt: "What's the spark?",
  },
  plans: {
    label: 'PLANS',
    color: '#3D8B8C',
    colorDark: '#0E2A2A',
    colorDim: '#2A6060',
    emptyState: 'Nothing in motion yet. Time to map something out.',
    quickPrompt: 'What needs to happen?',
  },
  research: {
    label: 'RESEARCH',
    color: '#C15B38',
    colorDark: '#2D1509',
    colorDim: '#8A3F27',
    emptyState: 'No rabbit holes filed. Drop a deep-dive topic in here.',
    quickPrompt: 'What are you investigating?',
  },
  contacts: {
    label: 'CONTACTS',
    color: '#7A8B4E',
    colorDark: '#1A2010',
    colorDim: '#556030',
    emptyState: 'Rolodex empty. Who should you be talking to?',
    quickPrompt: 'Who are they?',
  },
  journal: {
    label: 'JOURNAL',
    color: '#C8B98A',
    colorDark: '#3A3020',
    colorDim: '#9A8B6A',
    emptyState: 'No entries yet. Just start typing. Or talking.',
    quickPrompt: "What's on your mind?",
  },
} as const;
