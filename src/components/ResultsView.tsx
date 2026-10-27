import type { FlashCard, CardOutcome } from '../types';
import './ResultsView.css';

interface Props {
  cards: FlashCard[];
  outcomes: CardOutcome[];
  onRedoMissed: (missed: FlashCard[]) => void;
  onBack: () => void;
}

export function ResultsView({ cards, outcomes, onRedoMissed, onBack }: Props) {
  const gotCount = outcomes.filter((o) => o === 'got-it').length;
  const missedCount = outcomes.filter((o) => o === 'missed').length;
  const total = cards.length;
  const pct = total > 0 ? Math.round((gotCount / total) * 100) : 0;
  const missedCards = cards.filter((_, i) => outcomes[i] === 'missed');

  const emoji = pct === 100 ? '🎉' : pct >= 80 ? '👍' : pct >= 50 ? '💪' : '📚';
  const heading =
    pct === 100
      ? 'Perfect!'
      : pct >= 80
        ? 'Great work!'
        : pct >= 50
          ? 'Keep going!'
          : 'Keep practicing!';

  const circumference = 2 * Math.PI * 40;

  return (
    <div className="rv">
      <div className="rv-emoji">{emoji}</div>
      <h1 className="rv-heading">{heading}</h1>

      {/* Ring chart */}
      <div className="rv-ring">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="9" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--red)"
            strokeWidth="9"
            strokeDasharray={`${(circumference * pct) / 100} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text
            x="50"
            y="47"
            textAnchor="middle"
            dominantBaseline="middle"
            className="rv-pct-num"
          >
            {pct}%
          </text>
          <text x="50" y="62" textAnchor="middle" dominantBaseline="middle" className="rv-pct-sub">
            {gotCount}/{total}
          </text>
        </svg>
      </div>

      {/* Breakdown */}
      <div className="rv-breakdown">
        <div className="rv-stat rv-got">
          <span className="rv-val">{gotCount}</span>
          <span className="rv-lbl">Got it</span>
        </div>
        <div className="rv-divider" />
        <div className="rv-stat rv-missed">
          <span className="rv-val">{missedCount}</span>
          <span className="rv-lbl">Again</span>
        </div>
      </div>

      {/* Missed list */}
      {missedCards.length > 0 && (
        <div className="rv-miss-list">
          <p className="rv-miss-title">Review again ({missedCards.length})</p>
          {missedCards.map((card) => (
            <div key={card.id} className="rv-miss-row">
              <span className="rv-miss-q">{card.question}</span>
              <span className="rv-miss-a">{card.answer}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="rv-actions">
        {missedCards.length > 0 && (
          <button className="rv-btn rv-primary" onClick={() => onRedoMissed(missedCards)}>
            Redo {missedCards.length} missed {missedCards.length === 1 ? 'card' : 'cards'}
          </button>
        )}
        <button className="rv-btn rv-secondary" onClick={onBack}>
          ← Back to set
        </button>
      </div>
    </div>
  );
}
