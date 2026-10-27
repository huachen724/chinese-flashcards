import { useRef, useState } from 'react';
import type { FlashCard } from '../types';
import './UploadView.css';

type InputMode = 'json' | 'text';

function parseJson(raw: string): FlashCard[] {
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('Expected a JSON array at the top level');
  return data.map((item: unknown, i) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as Record<string, unknown>).question !== 'string' ||
      typeof (item as Record<string, unknown>).answer !== 'string'
    ) {
      throw new Error(`Item ${i} must have "question" and "answer" string fields`);
    }
    const { question, answer } = item as { question: string; answer: string };
    return { id: String(i), question, answer };
  });
}

function parseText(raw: string): FlashCard[] {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) throw new Error('No content found — paste at least 2 lines');
  if (lines.length % 2 !== 0) {
    throw new Error(
      `Expected an even number of lines, got ${lines.length}. ` +
        `First half = questions (pinyin), second half = answers (characters).`
    );
  }
  const half = lines.length / 2;
  return lines.slice(0, half).map((question, i) => ({
    id: String(i),
    question,
    answer: lines[half + i]!,
  }));
}

interface Props {
  onSave: (name: string, cards: FlashCard[]) => void;
  onBack: () => void;
}

export function UploadView({ onSave, onBack }: Props) {
  const [setName, setSetName] = useState('');
  const [mode, setMode] = useState<InputMode>('text');
  const [jsonText, setJsonText] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(String(ev.target?.result ?? ''));
      setError('');
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  }

  function handleSubmit() {
    setError('');
    try {
      const cards = mode === 'json' ? parseJson(jsonText) : parseText(pasteText);
      if (cards.length === 0) {
        setError('No cards found — check your input');
        return;
      }
      onSave(setName, cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  }

  const canSubmit =
    mode === 'json' ? jsonText.trim().length > 0 : pasteText.trim().length > 0;

  return (
    <div className="uv">
      <div className="uv-topbar">
        <button className="uv-back" onClick={onBack}>
          ‹ Library
        </button>
      </div>

      <div className="uv-hero">
        <span className="uv-hanzi">New Set</span>
        <p className="uv-sub">Give it a name, then paste your cards</p>
      </div>

      {/* Set name */}
      <div className="uv-name-row">
        <input
          className="uv-name-input"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder='Set name, e.g. "不如 — Jay Chou"'
        />
      </div>

      <div className="uv-tabs">
        <button
          className={`uv-tab${mode === 'text' ? ' active' : ''}`}
          onClick={() => {
            setMode('text');
            setError('');
          }}
        >
          Paste lines
        </button>
        <button
          className={`uv-tab${mode === 'json' ? ' active' : ''}`}
          onClick={() => {
            setMode('json');
            setError('');
          }}
        >
          JSON file
        </button>
      </div>

      {mode === 'text' ? (
        <div className="uv-section">
          <p className="uv-hint">
            Paste an <strong>even</strong> number of lines. Top half = questions (pinyin +
            meaning), bottom half = answers (characters), matched by position.
          </p>
          <pre className="uv-example">{`nǐ hǎo (hello)
wǒ (I / me)
你好
我`}</pre>
          <textarea
            className="uv-textarea"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`nǐ hǎo (hello)\nwǒ (I / me)\n你好\n我`}
            rows={10}
            spellCheck={false}
          />
        </div>
      ) : (
        <div className="uv-section">
          <p className="uv-hint">
            Upload or paste a JSON array with <code>question</code> (pinyin) and{' '}
            <code>answer</code> (characters) fields.
          </p>
          <pre className="uv-example">{`[
  { "question": "nǐ hǎo (hello)", "answer": "你好" },
  { "question": "wǒ (I / me)",    "answer": "我"  }
]`}</pre>
          <button className="uv-file-btn" onClick={() => fileRef.current?.click()}>
            ↑ Upload .json file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="uv-hidden"
            onChange={handleFile}
          />
          <textarea
            className="uv-textarea"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='[{"question": "nǐ hǎo (hello)", "answer": "你好"}, ...]'
            rows={7}
            spellCheck={false}
          />
        </div>
      )}

      {error && <p className="uv-error">{error}</p>}

      <button className="uv-start" onClick={handleSubmit} disabled={!canSubmit}>
        Create set →
      </button>
    </div>
  );
}
