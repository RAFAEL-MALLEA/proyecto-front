export default function Hero() {
  const tecnologias = [
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "MySQL",
    "PostgreSQL"
  ];

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 px-6 py-20 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>


          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Ingeniero en Informática
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Hola, soy{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Rafael Mallea Ramirez
            </span>
          </h1>

          <h2 className="mt-5 text-xl font-semibold text-slate-200 sm:text-2xl">
            Desarrollador Full Stack
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Desarrollo soluciones web conectando interfaces modernas,
            APIs REST y bases de datos. Mi objetivo es crear aplicaciones
            funcionales, ordenadas y orientadas a resolver necesidades
            reales.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#servicios"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Ver mis servicios
            </a>

            <a
              href="#certificaciones"
              className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Ver certificaciones
            </a>
            <a
            href="/documentos/rafael-mallea-cv.pdf"
            download="rafael-mallea-cv.pdf"
            className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-white"
            >
            Descargar CV
            </a>
          </div>
        </div>

        <div className="lg:justify-self-end">
          <div className="relative rounded-2xl border border-slate-700 bg-slate-900/80 p-7 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="mt-8">
              <p className="font-mono text-sm text-blue-300">
                perfil_profesional
              </p>

              <h3 className="mt-3 text-2xl font-bold text-white">
                Desarrollo web y soporte tecnológico
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Experiencia trabajando con frontend, backend, bases de
                datos, soporte TI y administración de sistemas.
              </p>

              <div className="mt-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Tecnologías principales
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {tecnologias.map((tecnologia) => (
                    <span
                      key={tecnologia}
                      className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300"
                    >
                      {tecnologia}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}