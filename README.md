# Portafolio Full Stack — Frontend

Frontend del portafolio profesional de **Rafael Alejandro Mallea Ramírez**, desarrollado con **Next.js, React, TypeScript y Tailwind CSS**.

La aplicación incluye una sección pública y un panel administrativo privado para gestionar el contenido del portafolio mediante una API REST desarrollada con FastAPI.

---

## Características

### Área pública

- Página principal del portafolio.
- Visualización de servicios.
- Visualización de certificaciones.
- Consumo de datos desde una API REST.
- Diseño responsive.

### Área administrativa

- Inicio de sesión mediante JWT.
- Validación de sesión con el backend.
- Protección de rutas privadas.
- Cierre de sesión.
- CRUD completo de servicios.
- CRUD completo de certificaciones.
- Actualización de la interfaz sin recargar la página.
- Manejo de errores y estados de carga.

---

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Fetch API
- JWT
- Session Storage

---

## Requisitos previos

Antes de ejecutar el proyecto debes tener instalado:

- Node.js
- npm
- El backend FastAPI ejecutándose



---

## Instalación

Clona el repositorio y entra en la carpeta del frontend:

```bash
git clone URL_DEL_REPOSITORIO
cd proyecto-front
```

Instala las dependencias:

```bash
npm install
```

---



La estructura debe quedar así:

```text
proyecto-front/
├── app/
├── components/
├── config/
├── services/
├── types/
├── .env.local
├── package.json
└── README.md
```





## Compilación de producción

Para comprobar TypeScript y generar una compilación optimizada:

```bash
npm run build
```

Para ejecutar la versión compilada:

```bash
npm run start
```

---



## Estructura principal

```text
app/
├── admin/
│   ├── certificaciones/
│   │   └── page.tsx
│   ├── servicios/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── login/
│   └── page.tsx
├── layout.tsx
└── page.tsx

components/
├── AdminGuard.tsx
├── CerrarSesionButton.tsx
├── CrearCertificacionForm.tsx
├── CrearServicioForm.tsx
├── EditarCertificacionForm.tsx
├── EditarServicioForm.tsx
├── HeaderAdmin.tsx
├── LoginForm.tsx
└── Sidebar.tsx

config/
└── api.ts

services/
├── auth.ts
├── certificaciones.ts
└── servicios.ts

types/
├── auth.ts
├── Certificacion.ts
└── Servicio.ts
```

---




## Endpoints utilizados


### Servicios

```http
GET /servicios/
POST /servicios/
PUT /servicios/?servicio_id={id}
DELETE /servicios/?servicio_id={id}
```

### Certificaciones

```http
GET /certificaciones/
POST /certificaciones/
PATCH /certificaciones/{id}
DELETE /certificaciones/?certificacion_id={id}
```

Las operaciones de creación, actualización y eliminación requieren autenticación mediante JWT.

---

## Estado actual del proyecto

- [x] Login con JWT
- [x] Validación de sesión
- [x] Protección de rutas administrativas
- [x] Cierre de sesión
- [x] CRUD de servicios
- [x] CRUD de certificaciones
- [x] Variables de entorno
- [x] Build de producción aprobado
- [ ] Diseño completo de la página pública
- [ ] Módulo de proyectos
- [ ] Experiencia laboral
- [ ] Tecnologías
- [ ] Formulario de contacto
- [ ] Pruebas automatizadas

---

## Próximos pasos

1. Construir la página pública del portafolio.
2. Crear componentes reutilizables para servicios y certificaciones.
3. Agregar proyectos, experiencia y tecnologías.
4. Implementar un formulario de contacto.
5. Mejorar el manejo seguro de la autenticación.
6. Agregar pruebas automatizadas.
7. Preparar el despliegue del frontend y backend.

---

## Autor

**Rafael Alejandro Mallea Ramírez**

Ingeniero en Informática y desarrollador Full Stack Junior.

LinkedIn:  
[https://www.linkedin.com/in/rafael-mallea-ramirez](https://www.linkedin.com/in/rafael-mallea-ramirez)

---

## Licencia

Este proyecto fue creado con fines profesionales, educativos y de portafolio.