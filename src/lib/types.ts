export interface InterviewQuestion {
  id: number;
  arcana: string;        // 카드 이름 (예: "The Magician")
  arcanaKo: string;      // 카드 한글 이름
  category: string;      // 질문 유형 (예: "직무역량", "인성", "경험")
  question: string;      // 면접 질문
}

export interface GenerateResult {
  keywords: string[];
  questions: InterviewQuestion[];
}

export interface Evaluation {
  score: number;         // 1-10
  strengths: string[];   // 잘한 점
  improvements: string[];// 개선할 점
  summary: string;       // 총평
}

export interface AnsweredCard {
  questionId: number;
  arcanaKo: string;
  question: string;
  transcript: string;
  evaluation: Evaluation;
  answeredAt: number;
}
