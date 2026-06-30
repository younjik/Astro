import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Naver Clova Speech (CSR) STT 프록시.
 * 브라우저에서 녹음한 오디오를 받아 클로바로 전달하고, 한국어 텍스트를 돌려줍니다.
 *
 * 환경변수:
 *   CLOVA_SPEECH_INVOKE_URL  (예: https://clovaspeech-gw.ncloud.com/external/v1/XXXX/XXXX)
 *   CLOVA_SPEECH_SECRET
 *
 * 참고: Clova Speech의 /recognizer/upload 엔드포인트는 multipart로
 *  - media: 오디오 파일
 *  - params: JSON 파라미터
 * 를 받습니다.
 */
export async function POST(req: NextRequest) {
  try {
    const invokeUrl = process.env.CLOVA_SPEECH_INVOKE_URL;
    const secret = process.env.CLOVA_SPEECH_SECRET;

    const inForm = await req.formData();
    const audio = inForm.get("audio") as File | null;
    if (!audio) {
      return NextResponse.json({ error: "오디오가 없습니다." }, { status: 400 });
    }

    // 키가 없으면 데모 모드: 안내 텍스트 반환 (로컬에서 키 없이 UI 테스트용)
    if (!invokeUrl || !secret) {
      return NextResponse.json({
        text: "[데모 모드] 클로바 API 키가 설정되지 않았습니다. .env.local에 CLOVA_SPEECH_INVOKE_URL과 CLOVA_SPEECH_SECRET을 추가하면 실제 음성 인식이 동작합니다. 지금은 이 자리에 변환된 답변 텍스트가 표시됩니다.",
        demo: true,
      });
    }

    const params = {
      language: "ko-KR",
      completion: "sync",
      fullText: true,
    };

    const upstream = new FormData();
    upstream.append(
      "media",
      new Blob([await audio.arrayBuffer()], { type: audio.type || "audio/webm" }),
      "answer.webm"
    );
    upstream.append("params", JSON.stringify(params));

    const res = await fetch(`${invokeUrl}/recognizer/upload`, {
      method: "POST",
      headers: {
        "X-CLOVASPEECH-API-KEY": secret,
      },
      body: upstream,
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[clova]", res.status, body);
      return NextResponse.json(
        { error: `클로바 STT 오류 (${res.status})` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text: string =
      data.text ||
      (Array.isArray(data.segments)
        ? data.segments.map((s: any) => s.text).join(" ")
        : "") ||
      "";

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("[/api/stt]", err);
    return NextResponse.json(
      { error: err?.message ?? "STT 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
