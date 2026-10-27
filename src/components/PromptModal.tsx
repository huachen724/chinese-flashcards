import { useState } from 'react';
import './PromptModal.css';

const PROMPT = `You are helping me build Chinese vocabulary flashcards.

I will paste Chinese text below (song lyrics, a poem, a news article, or any passage).

Your task:
1. Extract individual vocabulary items — single words or short meaningful phrases (typically 2–6 characters). Keep set idioms (成语/chéngyǔ) whole. Do NOT use full sentence lines or lyric lines as-is.
2. Remove duplicates — include each unique term only once.
3. Skip pure grammar particles (的, 了, 吗, 呢, 吧, 啊) unless they are part of a genuinely useful phrase.
4. Output EXACTLY an even number of plain lines with no headers, no numbers, and no extra commentary:
   - Top half: pinyin + English meaning in parentheses, one term per line.
     Example: bù rú (wouldn't it be better / why not)
   - Bottom half: the corresponding Chinese characters in the same order, one per line.
     Example: 不如

Paste the output directly into the flashcard app's "Paste lines" tab.

---
[Paste your Chinese text below this line]
`;

interface Props {
  onClose: () => void;
}

export function PromptModal({ onClose }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the textarea
    }
  }

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="pm-header">
          <div>
            <h2 className="pm-title">AI Flashcard Prompt</h2>
            <p className="pm-sub">Copy this, paste into ChatGPT or Claude, then add your Chinese text at the bottom.</p>
          </div>
          <button className="pm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <pre className="pm-text">{PROMPT}</pre>

        <button className="pm-copy" onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy prompt'}
        </button>
      </div>
    </div>
  );
}
