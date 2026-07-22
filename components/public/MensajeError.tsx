interface MensajeErrorProps {
  titulo: string;
  mensaje: string;
}

export default function MensajeError({
  titulo,
  mensaje,
}: MensajeErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
    >
      <p className="font-semibold">{titulo}</p>
      <p className="mt-1">{mensaje}</p>
    </div>
  );
}