// 10장의 메이저 아르카나 — 질문 카드에 매핑
export interface ArcanaMeta {
  name: string;
  nameKo: string;
  numeral: string;
  glyph: string;   // 카드 앞면 상징 (이모지/문자)
  hint: string;    // 카드가 상징하는 면접 테마
}

export const ARCANA: ArcanaMeta[] = [
  { name: "The Magician",    nameKo: "마법사",   numeral: "I",    glyph: "✦", hint: "직무 역량과 실행력" },
  { name: "The High Priestess", nameKo: "여사제", numeral: "II",  glyph: "☾", hint: "직관과 문제 인식" },
  { name: "The Empress",     nameKo: "여황제",   numeral: "III",  glyph: "❀", hint: "협업과 성장" },
  { name: "The Emperor",     nameKo: "황제",     numeral: "IV",   glyph: "♔", hint: "리더십과 책임감" },
  { name: "The Hierophant",  nameKo: "교황",     numeral: "V",    glyph: "⌖", hint: "가치관과 조직 적합성" },
  { name: "The Lovers",      nameKo: "연인",     numeral: "VI",   glyph: "❤", hint: "선택과 우선순위" },
  { name: "The Chariot",     nameKo: "전차",     numeral: "VII",  glyph: "➤", hint: "목표 달성과 추진력" },
  { name: "Strength",        nameKo: "힘",       numeral: "VIII", glyph: "∞", hint: "위기 극복 경험" },
  { name: "The Hermit",      nameKo: "은둔자",   numeral: "IX",   glyph: "✺", hint: "자기 성찰과 학습" },
  { name: "Wheel of Fortune",nameKo: "운명의 수레바퀴", numeral: "X", glyph: "✷", hint: "변화 적응력" },
];
