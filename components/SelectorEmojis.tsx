"use client";

const EMOJIS_DISPONIBLES = [
    "🤝", "💬", "💡", "👑", "🎯", "🧠",
    "⏱️", "🔥", "🌟", "🚀", "📈", "🤔",
    "🧩", "👥", "📋", "🎨", "💪", "✅",
    "🔄", "📣", "🧭", "⚡", "🏆", "📊",
];


interface SelectorEmojisProps {
    valorSeleccionado: string;
    onSeleccionar: (emoji: string) => void;
    disabled?: boolean;
}


export default function SelectorEmojis({
    valorSeleccionado,
    onSeleccionar,
    disabled = false,
}: SelectorEmojisProps) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-medium text-slate-500">
                Elige un ícono
            </p>

            <div className="flex flex-wrap gap-2">
                {EMOJIS_DISPONIBLES.map((emoji) => {
                    const seleccionado =
                        emoji === valorSeleccionado;

                    return (
                        <button
                            key={emoji}
                            type="button"
                            disabled={disabled}
                            onClick={() => onSeleccionar(emoji)}
                            aria-pressed={seleccionado}
                            aria-label={`Elegir ícono ${emoji}`}
                            className={
                                seleccionado
                                    ? "flex h-10 w-10 items-center justify-center rounded-lg border-2 border-blue-500 bg-blue-50 text-xl transition disabled:cursor-not-allowed disabled:opacity-60"
                                    : "flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                            }
                        >
                            {emoji}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}