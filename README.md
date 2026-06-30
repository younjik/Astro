# 타로 면접 · Arcana Interview

자소서와 채용공고를 업로드하면 Claude가 예상 면접 질문 10개를 뽑아 **타로 카드**로 펼칩니다.
카드를 뒤집어 질문을 받고, 1분 준비 후 음성으로 답하면 → Naver Clova가 텍스트로 옮기고 → Claude가 점수와 피드백을 줍니다.
결과는 한 장의 이미지로 저장할 수 있습니다.

## 흐름

1. **/** — 자소서(PDF/DOCX) + 채용공고(PDF/이미지) 업로드 → `질문 생성하기` → Claude가 키워드 추출 + 질문 10개 생성 → `/cards`로 이동
2. **/cards** — 카드 10장 스프레드. 클릭 → 3D 뒤집기 → 질문 공개 → 하단 드로어
   - `준비 시작` → **1분 카운트다운** (건너뛰기 가능)
   - 자동으로 **녹음 시작** (최대 2분, 직접 종료 가능)
   - 종료 → Clova STT → Claude 평가 → 점수(1–10) + 잘한 점 + 개선점 + 총평
3. **결과 보기** — 답변한 카드 요약 모달 → `📷 사진으로 저장`으로 PNG 다운로드

## 실행

```bash
npm install
cp .env.local.example .env.local   # 키 입력
npm run dev                        # http://localhost:3000
```

## 환경변수 (`.env.local`)

| 변수                      | 설명                               |
| ------------------------- | ---------------------------------- |
| `ANTHROPIC_API_KEY`       | Anthropic API 키 (질문 생성·평가)  |
| `CLOVA_SPEECH_INVOKE_URL` | Naver Clova Speech(CSR) Invoke URL |
| `CLOVA_SPEECH_SECRET`     | Clova Speech Secret Key            |

> Clova 키가 없어도 UI는 **데모 모드**로 동작합니다(녹음→안내 텍스트→Claude 평가까지 흐름 확인 가능). 실제 한국어 음성 인식은 키 설정 후 동작합니다.

## 구조

```
src/
  app/
    page.tsx              # Page 1 — 업로드
    cards/page.tsx        # Page 2 — 타로 스프레드 + 결과
    api/
      generate/route.ts   # 파일 파싱 + Claude 질문 생성
      stt/route.ts        # Clova Speech 프록시
      evaluate/route.ts   # Claude 답변 평가
  components/
    TarotCard.tsx         # 카드 + 3D 뒤집기
    AnswerDrawer.tsx      # 타이머·녹음·STT·평가 드로어
  lib/
    arcana.ts             # 메이저 아르카나 10장 데이터
    parse.ts              # PDF/DOCX/이미지 파싱
    useRecorder.ts        # MediaRecorder 훅
    types.ts
```

## 메모

- 상태는 `sessionStorage`에 저장 — 새로고침해도 답변 유지, 처음 화면으로 가면 초기화.
- 녹음은 브라우저 `MediaRecorder`(webm/mp4) 사용 → 마이크 권한 필요.
- Clova Speech `recognizer/upload` 동기(sync) 엔드포인트 기준. 콘솔에서 도메인 발급 후 Invoke URL을 그대로 넣으세요.
