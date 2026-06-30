import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "타로 면접 · Arcana Interview",
  description: "자소서와 채용공고로 운명의 면접 질문을 뽑고, 음성으로 답하고, 평가받으세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Nanum+Myeongjo:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="starfield">{children}</body>
    </html>
  );
}
