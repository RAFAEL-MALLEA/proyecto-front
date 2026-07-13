export default function AdminPage() {
  return (
    <>
    <main className="mb-5 flex flex-wrap items-start justify-start gap-4">
      <div className="flex flex-col bg-red-300 h-full p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-slate-500">
          Panel de administración
        </h1>
        <div className="flex flex-col items-center justify-content gap-2 mt-4 w-full">
          <button>certificaciones</button>
          <button>servicios</button>
        </div>
      </div>
      <div>
        <p className="mt-2 text-slate-600">
          Aquí gestionarás tus servicios y certificaciones.
        </p>
      </div>
    </main>

    </>
  );
}