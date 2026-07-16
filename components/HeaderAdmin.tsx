import CerrarSesionButton from "@/components/CerrarSesionButton";

export default function HeaderAdmin() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Panel de administración
        </h1>

        <p className="text-sm text-slate-500">
          Gestiona el contenido de tu portafolio
        </p>
      </div>

      <CerrarSesionButton />
    </header>
  );
}