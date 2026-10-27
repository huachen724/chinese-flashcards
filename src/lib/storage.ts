import type { FlashCard } from '../types';

export interface StudySet {
  id: string;
  name: string;
  createdAt: number;
  cards: FlashCard[];
}

const KEY = 'cf_sets_v1';

export function loadSets(): StudySet[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StudySet[]) : [];
  } catch {
    return [];
  }
}

function persist(sets: StudySet[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sets));
  } catch {
    // private browsing or storage full — fail silently
  }
}

export function createSet(name: string, cards: FlashCard[]): StudySet {
  const set: StudySet = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: name.trim() || `Set — ${new Date().toLocaleDateString()}`,
    createdAt: Date.now(),
    cards,
  };
  persist([set, ...loadSets()]);
  return set;
}

export function updateSet(updated: StudySet): void {
  persist(loadSets().map((s) => (s.id === updated.id ? updated : s)));
}

export function deleteSet(id: string): void {
  persist(loadSets().filter((s) => s.id !== id));
}
