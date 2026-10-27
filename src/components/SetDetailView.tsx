import { useState } from 'react';
import type { StudySet } from '../lib/storage';
import './SetDetailView.css';

interface Props {
  set: StudySet;
  onStudy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SetDetailView({ set, onStudy, onEdit, onDelete, onBack }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="sdv">
      <div className="sdv-header">
        <button className="sdv-back" onClick={onBack} aria-label="Back to library">
          ‹ Library
        </button>
      </div>

      <div className="sdv-hero">
        <h1 className="sdv-name">{set.name}</h1>
        <p className="sdv-meta">
          {set.cards.length} {set.cards.length === 1 ? 'card' : 'cards'} · Created {formatDate(set.createdAt)}
        </p>
      </div>

      <div className="sdv-actions">
        <button className="sdv-btn sdv-study" onClick={onStudy}>
          Study →
        </button>
        <button className="sdv-btn sdv-edit" onClick={onEdit}>
          Edit cards
        </button>
      </div>

      <div className="sdv-danger-zone">
        {confirming ? (
          <div className="sdv-confirm">
            <p className="sdv-confirm-msg">Delete "{set.name}"? This cannot be undone.</p>
            <div className="sdv-confirm-btns">
              <button className="sdv-confirm-cancel" onClick={() => setConfirming(false)}>
                Cancel
              </button>
              <button className="sdv-confirm-delete" onClick={onDelete}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button className="sdv-delete-link" onClick={() => setConfirming(true)}>
            Delete this set
          </button>
        )}
      </div>
    </div>
  );
}
