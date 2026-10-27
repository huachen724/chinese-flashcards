import { useEffect, useRef, useState } from 'react';
import type HanziWriter from 'hanzi-writer';
import './StrokeOrder.css';

/* CJK Unified Ideographs + Extension A */
const CJK = /[一-鿿㐀-䶿]/;

interface CharStrokeProps {
  character: string;
}

function CharStroke({ character }: CharStrokeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [available, setAvailable] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = '';
    let alive = true;

    /* Dynamic import keeps hanzi-writer out of the initial bundle parse */
    import('hanzi-writer').then(({ default: HanziWriter }) => {
      if (!alive || !el) return;
      try {
        const writer = HanziWriter.create(el, character, {
          width: 80,
          height: 80,
          padding: 8,
          showOutline: true,
          strokeColor: '#b91c1c',
          outlineColor: '#aaaaaa',
          drawingWidth: 3,
          onLoadCharDataError: () => {
            if (alive) setAvailable(false);
          },
        });
        writerRef.current = writer;
      } catch {
        if (alive) setAvailable(false);
      }
    });

    return () => {
      alive = false;
      writerRef.current = null;
      if (el) el.innerHTML = '';
    };
  }, [character]);

  function handlePlay() {
    const writer = writerRef.current;
    if (!writer || animating) return;
    setAnimating(true);
    writer.animateCharacter({ onComplete: () => setAnimating(false) });
  }

  if (!available) {
    return <span className="cs-fallback">{character}</span>;
  }

  return (
    <div className="cs">
      <div ref={containerRef} className="cs-canvas" />
      <button
        className="cs-play"
        onClick={handlePlay}
        disabled={animating}
        title="Animate stroke order"
        aria-label={`Animate stroke order for ${character}`}
      >
        {animating ? '⏸' : '▶'}
      </button>
    </div>
  );
}

interface Props {
  answer: string;
}

export function StrokeOrder({ answer }: Props) {
  const chars = [...answer].filter((c) => CJK.test(c));
  if (chars.length === 0) return null;

  return (
    <div className="stroke-order">
      <span className="so-label">Stroke order</span>
      <div className="so-chars">
        {chars.map((char, i) => (
          <CharStroke key={`${char}-${i}`} character={char} />
        ))}
      </div>
    </div>
  );
}
