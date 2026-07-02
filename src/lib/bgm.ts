"use client";

// 로딩 화면 ~ 카드 팝업 열리기 전까지 재생되는 배경음악을 관리하는 싱글턴.
// 페이지(라우트)가 바뀌어도 재생을 이어가야 하므로 모듈 스코프의 Audio 인스턴스 하나를 공유한다.
let audio: HTMLAudioElement | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;

function getAudio() {
  if (!audio && typeof window !== "undefined") {
    audio = new Audio("/universfield-calm-ambient-background-2-351472.mp3");
    audio.loop = true;
    audio.volume = 0.35;
  }
  return audio;
}

export function playBgm() {
  const a = getAudio();
  if (!a) return;
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
  a.volume = 0.35;
  a.play().catch(() => {
    // 브라우저 자동재생 정책으로 막히면 조용히 무시(사용자 클릭 흐름 안에서 호출되므로 대부분 허용됨)
  });
}

export function stopBgm(fadeMs = 700) {
  const a = getAudio();
  if (!a || a.paused) return;
  if (fadeTimer) clearInterval(fadeTimer);

  const steps = 14;
  const startVolume = a.volume;
  let i = 0;
  fadeTimer = setInterval(() => {
    i++;
    a.volume = Math.max(0, startVolume * (1 - i / steps));
    if (i >= steps) {
      if (fadeTimer) clearInterval(fadeTimer);
      fadeTimer = null;
      a.pause();
      a.currentTime = 0;
      a.volume = startVolume;
    }
  }, fadeMs / steps);
}
