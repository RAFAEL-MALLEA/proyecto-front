export default function AdminPage() {
  return (
    <>
    <main className="flex h-screen gap-4 ">
      <div className="flex flex-col bg-blue-300 gradient-color h-full p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-slate-500">
          Panel de administración
        </h1>
        <div className="flex flex-col items-center justify-content gap-2 mt-10 h-full">
          <button>certificaciones</button>
          <button>servicios</button>
        </div>
      </div>
      <div>
        <p className="p-4">
          Aquí gestionarás tus servicios y certificaciones.
        </p>
      </div>
    </main>

    </>
  );
}