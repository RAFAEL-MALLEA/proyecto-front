"use client";

import { useEffect, useRef, useState } from "react";

export default function ReproductorMusica() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [reproduciendo, setReproduciendo] =
    useState(false);

  const [silenciado, setSilenciado] =
    useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, []);

  async function alternarReproduccion() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        setReproduciendo(true);
      } else {
        audio.pause();
        setReproduciendo(false);
      }
    } catch (error) {
      console.error(
        "No fue posible reproducir el audio:",
        error
      );
    }
  }

  function alternarSilencio() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = !audio.muted;
    setSilenciado(audio.muted);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/90 p-2 text-white shadow-xl backdrop-blur">
      <audio
        ref={audioRef}
        src="/audio/musica-fondo.mp3"
        loop
        preload="metadata"
      />

      <button
        type="button"
        onClick={alternarReproduccion}
        aria-label={
          reproduciendo
            ? "Pausar música"
            : "Reproducir música"
        }
        className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {reproduciendo ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M8 5v14l11-7L8 5Z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={alternarSilencio}
        aria-label={
          silenciado
            ? "Activar sonido"
            : "Silenciar música"
        }
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-blue-500 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {silenciado ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="m16 9 5 6" />
            <path d="m21 9-5 6" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15 9.5a4 4 0 0 1 0 5" />
            <path d="M18 7a7 7 0 0 1 0 10" />
          </svg>
        )}
      </button>
    </div>
  );
}