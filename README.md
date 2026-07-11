Componentes → PascalCase

LoginForm.tsx
Sidebar.tsx
HeaderAdmin.tsx


Tipos → PascalCase

Auth.ts
Servicio.ts
Certificacion.ts


Servicios → minúsculas

auth.ts
servicios.ts
certificaciones.tsComponentes → PascalCase

LoginForm.tsx
Sidebar.tsx
HeaderAdmin.tsx


Tipos → PascalCase

Auth.ts
Servicio.ts
Certificacion.ts


Servicios → minúsculas

auth.ts
servicios.ts
certificaciones.ts








app/page.tsx
      │
      ├──────────────┐
      ▼              ▼
services/         services/
servicios.ts      certificaciones.ts
      │              │
      ▼              ▼
FastAPI          FastAPI
      │              │
      └──────┬───────┘
             ▼
           MySQL





app         → rutas y páginas
components  → interfaz reutilizable
services    → comunicación con FastAPI
types       → estructura TypeScript de los datos
public      → recursos estáticos