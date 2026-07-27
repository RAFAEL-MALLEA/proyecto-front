"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";


interface MusicaContexto {
  reproduciendo: boolean;
  silenciado: boolean;
  alternarReproduccion: () => Promise<void>;
  alternarSilencio: () => void;
}


const ContextoMusica =
  createContext<MusicaContexto | null>(null);


interface MusicaProviderProps {
  children: ReactNode;
}


export function MusicaProvider({
  children,
}: MusicaProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [reproduciendo, setReproduciendo] =
    useState(false);

  const [silenciado, setSilenciado] =
    useState(false);


  const alternarReproduccion = useCallback(
    async () => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (error) {
        console.error(
          "No fue posible reproducir el audio:",
          error
        );
      }
    },
    []
  );


  const alternarSilencio = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = !audio.muted;
    setSilenciado(audio.muted);
  }, []);


  const valorContexto = useMemo(
    () => ({
      reproduciendo,
      silenciado,
      alternarReproduccion,
      alternarSilencio,
    }),
    [
      reproduciendo,
      silenciado,
      alternarReproduccion,
      alternarSilencio,
    ]
  );


  return (
    <ContextoMusica.Provider value={valorContexto}>
      <audio
        ref={audioRef}
        src="/audio/musica-fondo.mp3"
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={(event) => {
          event.currentTarget.volume = 0.25;
          setSilenciado(event.currentTarget.muted);
        }}
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        onEnded={() => setReproduciendo(false)}
        onVolumeChange={(event) =>
          setSilenciado(event.currentTarget.muted)
        }
      />

      {children}
    </ContextoMusica.Provider>
  );
}


export function useMusica(): MusicaContexto {
  const contexto = useContext(ContextoMusica);

  if (!contexto) {
    throw new Error(
      "useMusica debe utilizarse dentro de MusicaProvider."
    );
  }

  return contexto;
}