import { useState } from 'react';
import type { StudySet } from '../lib/storage';
import type { FlashCard } from '../types';
import './EditView.css';

interface Props {
  set: StudySet;
  onSave: (updated: StudySet) => void;
  onBack: () => void;
}

export function EditView({ set, onSave, onBack }: Props) {
  const [name, setName] = useState(set.name);
  const [questions, setQuestions] = useState<string[]>(set.cards.map((c) => c.question));
  const [answers, setAnswers] = useState<string[]>(set.cards.map((c) => c.answer));
  const [error, setError] = useState('');

  const half = set.cards.length;

  function updateQ(i: number, val: string) {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? val : q)));
  }

  function updateA(i: number, val: string) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }

  function handleSave() {
    setError('');
    const qs = questions.map((q) => q.trim());
    const as = answers.map((a) => a.trim());

    if (qs.some((q) => !q) || as.some((a) => !a)) {
      setError('No line can be blank. Fill in or remove the empty rows.');
      return;
    }

    const cards: FlashCard[] = qs.map((question, i) => ({
      id: String(i),
      question,
      answer: as[i]!,
    }));

    onSave({ ...set, name: name.trim() || set.name, cards });
  }

  return (
    <div className="ev">
      <div className="ev-header">
        <button className="ev-back" onClick={onBack} aria-label="Back">
          ‹ Back
        </button>
        <button className="ev-save-top" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="ev-body">
        {/* Set name */}
        <div className="ev-name-row">
          <label className="ev-label" htmlFor="ev-name">Set name</label>
          <input
            id="ev-name"
            className="ev-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Set name"
          />
        </div>

        {/* Questions section */}
        <section className="ev-section">
          <div className="ev-section-header">
            <span className="ev-section-title">Questions</span>
            <span className="ev-section-hint">Pinyin + meaning · lines 1–{half}</span>
          </div>
          <div className="ev-rows">
            {questions.map((q, i) => (
              <div className="ev-row" key={i}>
                <span className="ev-num">{i + 1}</span>
                <input
                  className="ev-input"
                  value={q}
                  onChange={(e) => updateQ(i, e.target.value)}
                  placeholder={`Question ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Answers section */}
        <section className="ev-section">
          <div className="ev-section-header">
            <span className="ev-section-title">Answers</span>
            <span className="ev-section-hint">Characters · lines 1–{half} (matching above)</span>
          </div>
          <div className="ev-rows">
            {answers.map((a, i) => (
              <div className="ev-row" key={i}>
                <span className="ev-num">{i + 1}</span>
                <input
                  className="ev-input ev-input-hanzi"
                  value={a}
                  onChange={(e) => updateA(i, e.target.value)}
                  placeholder={`Answer ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </section>

        {error && <p className="ev-error">{error}</p>}

        <button className="ev-save-bottom" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  );
}
