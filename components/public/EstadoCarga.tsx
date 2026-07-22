interface EstadoCargaProps {
  mensaje?: string;
}

export default function EstadoCarga({
  mensaje = "Cargando información...",
}: EstadoCargaProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-40 flex-col items-center justify-center gap-4"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
      <p className="text-sm text-slate-500">{mensaje}</p>
    </div>
  );
}