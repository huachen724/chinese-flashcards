import { useState } from 'react';
import type { StudySet } from '../lib/storage';
import { PromptModal } from './PromptModal';
import './SetsView.css';

interface Props {
  sets: StudySet[];
  onNew: () => void;
  onOpen: (id: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SetsView({ sets, onNew, onOpen }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="sv">
      <div className="sv-header">
        <div>
          <span className="sv-title">汉字卡片</span>
          <p className="sv-sub">Chinese Flashcards</p>
        </div>
        <button className="sv-prompt-btn" onClick={() => setShowPrompt(true)} title="AI prompt for generating sets">
          AI Prompt
        </button>
      </div>

      <div className="sv-body">
        {sets.length === 0 ? (
          <div className="sv-empty">
            <span className="sv-empty-icon">📚</span>
            <p className="sv-empty-title">No sets yet</p>
            <p className="sv-empty-hint">Tap the button below to create your first set.</p>
          </div>
        ) : (
          <ul className="sv-list">
            {sets.map((set) => (
              <li key={set.id}>
                <button className="sv-item" onClick={() => onOpen(set.id)}>
                  <div className="sv-item-main">
                    <span className="sv-item-name">{set.name}</span>
                    <span className="sv-item-meta">
                      {set.cards.length} cards · {formatDate(set.createdAt)}
                    </span>
                  </div>
                  <span className="sv-item-arrow">›</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sv-footer">
        <button className="sv-new-btn" onClick={onNew}>
          + New set
        </button>
      </div>

      {showPrompt && <PromptModal onClose={() => setShowPrompt(false)} />}
    </div>
  );
}
