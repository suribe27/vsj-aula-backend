# Alerta Temprana — Backend (API REST)

API de **Soluciones VSJ — Alerta Temprana**: los estudiantes responden una encuesta corta (notas + bienestar), la API calcula su nivel de riesgo académico-emocional y les recomienda servicios de Bienestar Universitario. Bienestar (rol admin) gestiona el catálogo de servicios y ve estadísticas **anónimas**.

Proyecto de Aula — Desarrollo Web Full-Stack, semestre 2026-2.

## Despliegue

| Qué | URL |
| --- | --- |
| API (Railway) | https://vsj-aula-backend-production.up.railway.app |
| Frontend (Vercel) | https://URL-DE-VERCEL.vercel.app |
| Repositorio frontend | https://github.com/suribe27/vsj-aula-frontend |

## Tecnologías

Node.js 22 · Express 5 · TypeScript · Prisma · PostgreSQL (Supabase) · JWT · bcrypt · Zod · Multer · Supabase Storage · Vitest

## Instalación y ejecución

```bash
npm install
cp .env.example .env          # completa las variables (ver abajo)
npx prisma migrate dev        # crea las tablas
npm run db:seed               # crea admin, estudiante, categorías y servicios
npm run dev                   # http://localhost:4000
```

Otros scripts: `npm run build`, `npm start`, `npm run lint`, `npm test`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (por defecto 4000) |
| `DATABASE_URL` | Cadena de conexión de PostgreSQL |
| `JWT_SECRET` | Secreto para firmar los tokens (obligatorio, sin valor por defecto) |
| `JWT_EXPIRES_IN` | Duración del token, por ejemplo `2h` |
| `CORS_ORIGIN` | URL del frontend (varias separadas por coma) |
| `SUPABASE_URL` | URL del proyecto de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Llave *service role* de Supabase (solo en el servidor) |
| `SUPABASE_BUCKET` | Nombre del bucket público donde se guardan las imágenes |

## Credenciales de prueba (creadas por el seed)

| Rol | Correo | Contraseña |
| --- | --- | --- |
| admin (Bienestar) | `admin@vsj.edu.co` | `Admin2026*` |
| user (estudiante) | `estudiante@vsj.edu.co` | `Estudiante2026*` |

## Modelo de datos

- **users** — registro, login y rol (`ADMIN` o `USER`).
- **categories** — categorías de apoyo con un enfoque (`ACADEMIC`, `EMOTIONAL`, `FINANCIAL`).
- **services** — servicios de Bienestar con imagen. **Llave foránea** `category_id → categories`.
- **evaluations** — respuestas de la encuesta y riesgo calculado. **Llave foránea** `user_id → users`, usada solo para que el estudiante vea sus evaluaciones: la API nunca la devuelve.

Todas las tablas de recursos tienen borrado lógico (`status = INACTIVE`).

## Endpoints

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | público | Registro (rol user). 201, 409 si el correo existe |
| POST | `/api/auth/login` | público | Login. 401 con mensaje genérico |
| GET | `/api/auth/me` | autenticado | Usuario actual |
| GET | `/api/categories` | público | Listado paginado (`page`, `limit`, `search`, `focus`) |
| GET | `/api/categories/:id` | público | Detalle |
| POST / PUT / DELETE | `/api/categories[/:id]` | admin | Crear, editar, borrado lógico |
| GET | `/api/services` | público | Listado paginado (`page`, `limit`, `search`, `categoryId`, `focus`) |
| GET | `/api/services/:id` | público | Detalle |
| POST / PUT | `/api/services[/:id]` | admin | `multipart/form-data` con campo `image` (sube a Supabase) |
| DELETE | `/api/services/:id` | admin | Borrado lógico |
| GET | `/api/evaluations` | autenticado | Estudiante: las suyas. Admin: todas, anónimas (`riskLevel`) |
| GET | `/api/evaluations/summary` | admin | Conteo por nivel de riesgo |
| GET | `/api/evaluations/:id` | dueño o admin | Resultado y servicios recomendados |
| POST / PUT | `/api/evaluations[/:id]` | user | Responder o editar la encuesta |
| DELETE | `/api/evaluations/:id` | dueño o admin | Borrado lógico |

Los listados responden `{ data, pagination: { total, currentPage, limit, totalPages } }`; los errores, `{ error: { message, details? } }`.

## Arquitectura

```
src/
├── domain/          → models/ y repository/ (interfaces)
├── application/     → use-cases/, rules/ (cálculo del riesgo), ports/, errors/
├── infrastructure/  → repository/ (Prisma), services/ (bcrypt, JWT, Supabase), dtos/ (Zod), config/
├── interface/       → controllers/, routers/, middlewares/, http/
├── container.ts     → conecta implementaciones con casos de uso
├── app.ts / server.ts
```

## Reparto del trabajo

| Integrante | Qué construyó |
| --- | --- |
| Samuel Uribe Salazar | Configuración del proyecto, esquema de Prisma y seed, autenticación JWT y middlewares de autenticación y rol, CRUD de servicios con subida de imágenes a Supabase, despliegue en Railway |
| Valery Monsalve | CRUD de categorías, CRUD de evaluaciones y regla de cálculo del riesgo con sus pruebas |
