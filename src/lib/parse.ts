import mammoth from "mammoth";

// pdf-parse는 동적 import (빌드 시 테스트파일 참조 이슈 회피)
async function parsePdf(buf: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buf);
  return data.text || "";
}

async function parseDocx(buf: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer: buf });
  return value || "";
}

export interface ParsedFile {
  text: string;          // 추출된 텍스트 (없으면 빈 문자열)
  imageBase64?: string;  // 이미지인 경우 base64
  mediaType?: string;    // 이미지 media type
}

export async function parseUpload(file: File): Promise<ParsedFile> {
  const buf = Buffer.from(await file.arrayBuffer());
  const type = file.type;
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return { text: await parsePdf(buf) };
  }
  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return { text: await parseDocx(buf) };
  }
  if (type.startsWith("image/")) {
    return {
      text: "",
      imageBase64: buf.toString("base64"),
      mediaType: type,
    };
  }
  // fallback: plain text
  return { text: buf.toString("utf-8") };
}
