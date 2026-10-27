import { useState } from 'react';
import type { FlashCard, CardOutcome } from './types';
import type { StudySet } from './lib/storage';
import { loadSets, createSet, updateSet, deleteSet } from './lib/storage';
import { SetsView } from './components/SetsView';
import { UploadView } from './components/UploadView';
import { SetDetailView } from './components/SetDetailView';
import { EditView } from './components/EditView';
import { DeckView } from './components/DeckView';
import { ResultsView } from './components/ResultsView';
import './App.css';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type View =
  | { mode: 'sets' }
  | { mode: 'create' }
  | { mode: 'detail'; setId: string }
  | { mode: 'edit'; setId: string }
  | { mode: 'deck'; setId: string; cards: FlashCard[]; originalCards: FlashCard[] }
  | { mode: 'results'; setId: string; cards: FlashCard[]; originalCards: FlashCard[]; outcomes: CardOutcome[] };

export default function App() {
  const [view, setView] = useState<View>({ mode: 'sets' });
  const [sets, setSets] = useState<StudySet[]>(loadSets);

  function refresh() {
    setSets(loadSets());
  }

  function handleCreate(name: string, cards: FlashCard[]) {
    createSet(name, cards);
    refresh();
    setView({ mode: 'sets' });
  }

  function handleUpdate(updated: StudySet) {
    updateSet(updated);
    refresh();
    setView({ mode: 'detail', setId: updated.id });
  }

  function handleDelete(id: string) {
    deleteSet(id);
    refresh();
    setView({ mode: 'sets' });
  }

  const currentSet =
    view.mode !== 'sets' && view.mode !== 'create'
      ? (sets.find((s) => s.id === view.setId) ?? null)
      : null;

  return (
    <div className="app">
      {view.mode === 'sets' && (
        <SetsView
          sets={sets}
          onNew={() => setView({ mode: 'create' })}
          onOpen={(id) => setView({ mode: 'detail', setId: id })}
        />
      )}

      {view.mode === 'create' && (
        <UploadView
          onSave={handleCreate}
          onBack={() => setView({ mode: 'sets' })}
        />
      )}

      {view.mode === 'detail' && currentSet && (
        <SetDetailView
          set={currentSet}
          onStudy={() =>
            setView({
              mode: 'deck',
              setId: currentSet.id,
              cards: shuffle(currentSet.cards),
              originalCards: currentSet.cards,
            })
          }
          onEdit={() => setView({ mode: 'edit', setId: currentSet.id })}
          onDelete={() => handleDelete(currentSet.id)}
          onBack={() => setView({ mode: 'sets' })}
        />
      )}

      {view.mode === 'edit' && currentSet && (
        <EditView
          set={currentSet}
          onSave={handleUpdate}
          onBack={() => setView({ mode: 'detail', setId: currentSet.id })}
        />
      )}

      {view.mode === 'deck' && (
        <DeckView
          cards={view.cards}
          onDone={(outcomes) =>
            setView({
              mode: 'results',
              setId: view.setId,
              cards: view.cards,
              originalCards: view.originalCards,
              outcomes,
            })
          }
          onShuffle={() => setView({ ...view, cards: shuffle(view.originalCards) })}
          onHome={() => setView({ mode: 'detail', setId: view.setId })}
        />
      )}

      {view.mode === 'results' && (
        <ResultsView
          cards={view.cards}
          outcomes={view.outcomes}
          onRedoMissed={(missed) =>
            setView({
              mode: 'deck',
              setId: view.setId,
              cards: shuffle(missed),
              originalCards: missed,
            })
          }
          onBack={() => setView({ mode: 'detail', setId: view.setId })}
        />
      )}
    </div>
  );
}
