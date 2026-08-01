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


const canciones = [
  "/audio/musica-fondo.mp3",
  "/audio/musica-fondo-2.mp3",
];


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

  /*
   * Indica que el cambio de canción fue automático
   * porque terminó la canción anterior.
   */
  const reproducirSiguienteRef = useRef(false);

  const [reproduciendo, setReproduciendo] =
    useState(false);

  const [silenciado, setSilenciado] =
    useState(false);

  const [indiceCancion, setIndiceCancion] =
    useState(0);


  const alternarReproduccion = useCallback(
    async () => {
      const audio = audioRef.current;

      if (!audio || canciones.length === 0) {
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


  const avanzarCancion = useCallback(() => {
    if (canciones.length === 0) {
      return;
    }

    reproducirSiguienteRef.current = true;

    setIndiceCancion((indiceActual) => {
      return (
        (indiceActual + 1) %
        canciones.length
      );
    });
  }, []);


  const reproducirCancionCargada =
    useCallback(
      async (
        audio: HTMLAudioElement
      ) => {
        if (!reproducirSiguienteRef.current) {
          return;
        }

        /*
         * Se cambia antes de play() para impedir
         * llamadas repetidas del evento canplay.
         */
        reproducirSiguienteRef.current = false;

        try {
          await audio.play();
        } catch (error) {
          setReproduciendo(false);

          console.error(
            "No fue posible reproducir la siguiente canción:",
            error
          );
        }
      },
      []
    );


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
    <ContextoMusica.Provider
      value={valorContexto}
    >
      {canciones.length > 0 && (
        <audio
          ref={audioRef}
          src={canciones[indiceCancion]}
          playsInline
          preload="metadata"
          onLoadedMetadata={(event) => {
            event.currentTarget.volume = 0.25;
          }}
          onCanPlay={(event) => {
            void reproducirCancionCargada(
              event.currentTarget
            );
          }}
          onPlay={() => {
            setReproduciendo(true);
          }}
          onPause={() => {
            setReproduciendo(false);
          }}
          onEnded={avanzarCancion}
          onVolumeChange={(event) => {
            setSilenciado(
              event.currentTarget.muted
            );
          }}
          onError={(event) => {
            console.error(
              "No fue posible cargar la canción:",
              canciones[indiceCancion],
              event.currentTarget.error
            );

            reproducirSiguienteRef.current =
              false;

            setReproduciendo(false);
          }}
        />
      )}

      {children}
    </ContextoMusica.Provider>
  );
}


export function useMusica(): MusicaContexto {
  const contexto = useContext(
    ContextoMusica
  );

  if (!contexto) {
    throw new Error(
      "useMusica debe utilizarse dentro de MusicaProvider."
    );
  }

  return contexto;
}