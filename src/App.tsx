import { useState } from 'react';
import type { FlashCard, CardOutcome } from './types';
import { UploadView } from './components/UploadView';
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
  | { mode: 'upload' }
  | { mode: 'deck'; cards: FlashCard[]; originalCards: FlashCard[] }
  | { mode: 'results'; cards: FlashCard[]; originalCards: FlashCard[]; outcomes: CardOutcome[] };

export default function App() {
  const [view, setView] = useState<View>({ mode: 'upload' });

  function startDeck(cards: FlashCard[]) {
    setView({ mode: 'deck', cards: shuffle(cards), originalCards: cards });
  }

  return (
    <div className="app">
      {view.mode === 'upload' && <UploadView onStart={startDeck} />}
      {view.mode === 'deck' && (
        <DeckView
          cards={view.cards}
          onDone={(outcomes) =>
            setView({ mode: 'results', cards: view.cards, originalCards: view.originalCards, outcomes })
          }
          onShuffle={() => setView({ ...view, cards: shuffle(view.originalCards) })}
          onHome={() => setView({ mode: 'upload' })}
        />
      )}
      {view.mode === 'results' && (
        <ResultsView
          cards={view.cards}
          outcomes={view.outcomes}
          onRedoMissed={(missed) =>
            setView({ mode: 'deck', cards: shuffle(missed), originalCards: missed })
          }
          onRestart={() => setView({ mode: 'upload' })}
        />
      )}
    </div>
  );
}
