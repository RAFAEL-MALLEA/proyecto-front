interface MensajeErrorProps {
  mensaje: string;
}

export default function MensajeError({
  mensaje,
}: MensajeErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
    >
      <p className="font-semibold">
        No fue posible cargar la información
      </p>

      <p className="mt-1">
        {mensaje}
      </p>
    </div>
  );
}