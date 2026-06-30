"use client";

import type { ArcanaMeta } from "@/lib/arcana";

export function TarotCard({
  arc,
  index,
  flipped,
  answered,
  score,
  onClick,
}: {
  arc: ArcanaMeta;
  index: number;
  flipped: boolean;
  answered: boolean;
  score?: number;
  onClick: () => void;
}) {
  return (
    <button
      className={`card ${flipped ? "flipped" : ""} ${answered ? "answered" : ""}`}
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={onClick}
      aria-label={`${arc.nameKo} 카드`}
    >
      <div className="inner">
        {/* 뒷면 */}
        <div className="face back">
          <div className="back-frame">
            <div className="back-glyph serif">✶</div>
            <div className="back-lines" />
          </div>
        </div>
        {/* 앞면 */}
        <div className="face front">
          <div className="numeral serif">{arc.numeral}</div>
          <div className="glyph serif">{arc.glyph}</div>
          <div className="name serif">{arc.nameKo}</div>
          <div className="name-en">{arc.name}</div>
          {answered && score != null && (
            <div className="score-badge">{score}</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .card {
          all: unset;
          cursor: pointer;
          aspect-ratio: 2 / 3;
          perspective: 1200px;
          animation: deal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }
        @keyframes deal {
          from { opacity: 0; transform: translateY(24px) rotateZ(-4deg); }
          to { opacity: 1; transform: translateY(0) rotateZ(0); }
        }
        .inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4, 0.1, 0.2, 1);
        }
        .card.flipped .inner { transform: rotateY(180deg); }
        .card:hover .inner { transform: translateY(-6px) rotateZ(1deg); }
        .card.flipped:hover .inner { transform: rotateY(180deg) translateY(-6px); }

        .face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--line);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        /* 뒷면 */
        .back {
          background:
            radial-gradient(circle at 50% 40%, rgba(201,162,75,0.18), transparent 60%),
            linear-gradient(160deg, #221d44, #14102b);
        }
        .back-frame {
          position: absolute;
          inset: 8px;
          border: 1px solid var(--line);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .back-glyph {
          font-size: clamp(28px, 7vw, 44px);
          color: var(--gold);
          opacity: 0.9;
        }
        .back-lines {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(45deg, rgba(201,162,75,0.06) 0 6px, transparent 6px 12px);
        }

        /* 앞면 */
        .front {
          transform: rotateY(180deg);
          background:
            radial-gradient(circle at 50% 30%, rgba(201,162,75,0.16), transparent 65%),
            linear-gradient(170deg, #1f1b3a, #15122c);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
        }
        .front::after {
          content: "";
          position: absolute;
          inset: 6px;
          border: 1px solid var(--line);
          border-radius: 7px;
          pointer-events: none;
        }
        .numeral {
          position: absolute;
          top: 10px;
          font-size: 13px;
          color: var(--gold);
          letter-spacing: 0.1em;
        }
        .glyph {
          font-size: clamp(30px, 8vw, 46px);
          color: var(--gold-bright);
        }
        .name {
          font-size: clamp(15px, 3.5vw, 19px);
          color: var(--parchment);
        }
        .name-en {
          font-size: 9.5px;
          letter-spacing: 0.16em;
          color: var(--mist);
          text-transform: uppercase;
        }
        .card.answered .front {
          border-color: var(--gold);
        }
        .score-badge {
          position: absolute;
          bottom: 9px;
          right: 9px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--gold);
          color: var(--void);
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </button>
  );
}
