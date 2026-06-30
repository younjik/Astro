"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { GenerateResult } from "@/lib/types";

function FileSlot({
  label,
  accept,
  file,
  onPick,
}: {
  label: string;
  accept: string;
  file: File | null;
  onPick: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div
      className={`slot ${file ? "filled" : ""} ${drag ? "drag" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files?.[0]) onPick(e.dataTransfer.files[0]);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      <div className="slot-glyph">{file ? "✓" : "+"}</div>
      <div className="slot-label">{label}</div>
      <div className="slot-sub">
        {file ? file.name : "클릭 또는 드래그하여 업로드"}
      </div>

      <style jsx>{`
        .slot {
          position: relative;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 34px 24px;
          text-align: center;
          background: linear-gradient(180deg, rgba(31, 27, 58, 0.6), rgba(22, 19, 42, 0.35));
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          backdrop-filter: blur(2px);
        }
        .slot:hover, .slot.drag {
          transform: translateY(-3px);
          border-color: var(--gold);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(201, 162, 75, 0.15) inset;
        }
        .slot.filled {
          border-color: var(--gold);
          background: linear-gradient(180deg, rgba(201, 162, 75, 0.12), rgba(22, 19, 42, 0.4));
        }
        .slot-glyph {
          font-family: var(--font-display);
          font-size: 40px;
          color: var(--gold-bright);
          line-height: 1;
          margin-bottom: 14px;
        }
        .slot-label {
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: 0.02em;
          margin-bottom: 6px;
        }
        .slot-sub {
          font-size: 13px;
          color: var(--mist);
          word-break: break-all;
          padding: 0 8px;
        }
      `}</style>
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [job, setJob] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = resume && job && !loading;

  async function handleGenerate() {
    if (!resume || !job) return;
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("resume", resume);
      fd.append("job", job);
      const res = await fetch("/api/generate", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "질문 생성 실패");

      const result = data as GenerateResult;
      sessionStorage.setItem("interview:generate", JSON.stringify(result));
      sessionStorage.removeItem("interview:answers");
      router.push("/cards");
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <header className="hero">
        <div className="eyebrow">ARCANA · INTERVIEW</div>
        <h1 className="serif title">
          당신의 면접은
          <br />
          이미 카드에 적혀 있다
        </h1>
        <p className="lede">
          자소서와 채용공고를 펼쳐 두면, 그 안에서 운명의 면접 질문 열 장을
          뽑아냅니다. 카드를 뒤집고, 목소리로 답하고, 평가를 받으세요.
        </p>
      </header>

      <section className="slots">
        <FileSlot
          label="자기소개서"
          accept=".pdf,.docx"
          file={resume}
          onPick={setResume}
        />
        <FileSlot
          label="채용공고"
          accept=".pdf,.png,.jpg,.jpeg"
          file={job}
          onPick={setJob}
        />
      </section>

      {error && <div className="error">⚠ {error}</div>}

      <button className="cta" disabled={!ready} onClick={handleGenerate}>
        {loading ? (
          <span className="loading-text">카드를 펼치는 중…</span>
        ) : (
          "질문 생성하기"
        )}
      </button>

      <div className="hint">PDF · DOCX 자소서 / PDF · 이미지 채용공고 지원</div>

      <style jsx>{`
        .wrap {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          padding: 72px 24px 96px;
        }
        .hero {
          text-align: center;
          margin-bottom: 52px;
        }
        .eyebrow {
          font-size: 12px;
          letter-spacing: 0.42em;
          color: var(--gold);
          margin-bottom: 20px;
        }
        .title {
          font-size: clamp(36px, 7vw, 60px);
          font-weight: 600;
          line-height: 1.12;
          letter-spacing: 0.01em;
        }
        .lede {
          margin: 22px auto 0;
          max-width: 480px;
          color: var(--mist);
          font-size: 15.5px;
          line-height: 1.7;
        }
        .slots {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 28px;
        }
        @media (max-width: 560px) {
          .slots { grid-template-columns: 1fr; }
        }
        .error {
          color: var(--ember);
          background: rgba(194, 84, 58, 0.1);
          border: 1px solid rgba(194, 84, 58, 0.35);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 18px;
          font-size: 14px;
        }
        .cta {
          width: 100%;
          padding: 18px;
          font-size: 17px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--void);
          background: linear-gradient(180deg, var(--gold-bright), var(--gold));
          border: none;
          border-radius: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
          box-shadow: 0 10px 34px rgba(201, 162, 75, 0.28);
        }
        .cta:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 44px rgba(201, 162, 75, 0.4);
        }
        .cta:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .loading-text {
          display: inline-block;
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .hint {
          text-align: center;
          margin-top: 18px;
          font-size: 12.5px;
          color: var(--mist);
          opacity: 0.7;
        }
      `}</style>
    </main>
  );
}
