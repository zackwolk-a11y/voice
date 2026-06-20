'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { BrainItem, HubType } from './types';

const STORAGE_KEY = 'zacks-2nd-brain-v1';

export interface StoreState {
  items: BrainItem[];
  activeHub: HubType | 'home';
  selectedItemId: string | null;
  isQuickCaptureOpen: boolean;
  quickCaptureHub: HubType;
}

type Action =
  | { type: 'HYDRATE'; items: BrainItem[] }
  | { type: 'ADD_ITEM'; item: BrainItem }
  | { type: 'UPDATE_ITEM'; item: BrainItem }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'TOGGLE_PIN'; id: string }
  | { type: 'SET_HUB'; hub: HubType | 'home' }
  | { type: 'SELECT_ITEM'; id: string | null }
  | { type: 'OPEN_QUICK_CAPTURE'; hub?: HubType }
  | { type: 'CLOSE_QUICK_CAPTURE' }
  | { type: 'TOGGLE_CHECKLIST'; itemId: string; checkId: string };

const initialState: StoreState = {
  items: [],
  activeHub: 'home',
  selectedItemId: null,
  isQuickCaptureOpen: false,
  quickCaptureHub: 'ideas',
};

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };

    case 'ADD_ITEM':
      return { ...state, items: [action.item, ...state.items] };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.item.id ? action.item : i)),
      };

    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
        selectedItemId:
          state.selectedItemId === action.id ? null : state.selectedItemId,
      };

    case 'TOGGLE_PIN':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, pinned: !i.pinned } : i
        ),
      };

    case 'SET_HUB':
      return { ...state, activeHub: action.hub, selectedItemId: null };

    case 'SELECT_ITEM':
      return { ...state, selectedItemId: action.id };

    case 'OPEN_QUICK_CAPTURE':
      return {
        ...state,
        isQuickCaptureOpen: true,
        quickCaptureHub:
          action.hub ??
          (state.activeHub === 'home' ? 'ideas' : (state.activeHub as HubType)),
      };

    case 'CLOSE_QUICK_CAPTURE':
      return { ...state, isQuickCaptureOpen: false };

    case 'TOGGLE_CHECKLIST':
      return {
        ...state,
        items: state.items.map((i) => {
          if (i.id !== action.itemId || !i.checklist) return i;
          return {
            ...i,
            checklist: i.checklist.map((c) =>
              c.id === action.checkId ? { ...c, done: !c.done } : c
            ),
            updatedAt: new Date().toISOString(),
          };
        }),
      };

    default:
      return state;
  }
}

interface StoreCtx {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
  addItem: (partial: Omit<BrainItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateItem: (item: BrainItem) => void;
  deleteItem: (id: string) => void;
  getHubItems: (hub: HubType) => BrainItem[];
  getItem: (id: string) => BrainItem | undefined;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const addItem = useCallback(
    (partial: Omit<BrainItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
      const now = new Date().toISOString();
      const item: BrainItem = {
        ...partial,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_ITEM', item });
      return item.id;
    },
    []
  );

  const updateItem = useCallback((item: BrainItem) => {
    dispatch({
      type: 'UPDATE_ITEM',
      item: { ...item, updatedAt: new Date().toISOString() },
    });
  }, []);

  const deleteItem = useCallback(
    (id: string) => dispatch({ type: 'DELETE_ITEM', id }),
    []
  );

  const getHubItems = useCallback(
    (hub: HubType) =>
      state.items
        .filter((i) => i.hub === hub)
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }),
    [state.items]
  );

  const getItem = useCallback(
    (id: string) => state.items.find((i) => i.id === id),
    [state.items]
  );

  return (
    <StoreContext.Provider
      value={{ state, dispatch, addItem, updateItem, deleteItem, getHubItems, getItem }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
