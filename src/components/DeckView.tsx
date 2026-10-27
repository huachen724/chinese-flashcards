import { useCallback, useEffect, useState } from 'react';
import type { FlashCard, CardOutcome } from '../types';
import { StrokeOrder } from './StrokeOrder';
import './DeckView.css';

interface Props {
  cards: FlashCard[];
  onDone: (outcomes: CardOutcome[]) => void;
  onShuffle: () => void;
  onHome: () => void;
}

export function DeckView({ cards, onDone, onShuffle, onHome }: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [outcomes, setOutcomes] = useState<CardOutcome[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const card = cards[index];

  const advance = useCallback(
    (outcome: CardOutcome) => {
      const next = [...outcomes, outcome];
      if (index + 1 >= cards.length) {
        onDone(next);
      } else {
        setOutcomes(next);
        setIndex((i) => i + 1);
        setRevealed(false);
      }
    },
    [outcomes, index, cards.length, onDone],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed) setRevealed(true);
      } else if (e.key === 'ArrowLeft' && revealed) {
        advance('got-it');
      } else if (e.key === 'ArrowRight' && revealed) {
        advance('missed');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, revealed]);

  if (!card) return null;

  const progress = (index / cards.length) * 100;

  return (
    <div className="dv" onClick={() => menuOpen && setMenuOpen(false)}>
      {/* Header */}
      <div className="dv-header">
        <div className="dv-bar">
          <div className="dv-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="dv-header-row">
          <span className="dv-counter">
            {index + 1} / {cards.length}
          </span>
          <div className="dv-menu">
            <button
              className="dv-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              aria-label="Options"
            >
              ···
            </button>
            {menuOpen && (
              <div className="dv-dropdown">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onShuffle();
                  }}
                >
                  🔀 Shuffle &amp; restart
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onHome();
                  }}
                >
                  🏠 Back to upload
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="dv-body">
        {/* Question */}
        <div className="dv-question">
          <span className="dv-label">Pinyin / Meaning</span>
          <p className="dv-question-text">{card.question}</p>
          {!revealed && (
            <p className="dv-write-hint">Write the character(s) on paper, then reveal</p>
          )}
        </div>

        {/* Answer (revealed) */}
        {revealed ? (
          <div className="dv-answer">
            <span className="dv-label">Character(s)</span>
            <p className="dv-answer-text">{card.answer}</p>
            <StrokeOrder answer={card.answer} />
          </div>
        ) : (
          <button className="dv-reveal" onClick={() => setRevealed(true)}>
            Show answer
          </button>
        )}
      </div>

      {/* Action buttons */}
      {revealed && (
        <div className="dv-actions">
          <button className="dv-btn dv-got" onClick={() => advance('got-it')}>
            ✓ Got it
          </button>
          <button className="dv-btn dv-again" onClick={() => advance('missed')}>
            ✗ Again
          </button>
        </div>
      )}

      {revealed && <p className="dv-kb-hint">← got it · → again</p>}
    </div>
  );
}
