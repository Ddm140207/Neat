![Neat! Banner](frontend/public/banner.jpg)

# Neat! — Stay organized

Neat! es una aplicación web open source moderna para gestión de notas con diseño moderno, editor enriquecido, colaboración en tiempo real y experiencia tipo Google Docs.

## Características

- Registro e inicio de sesión con JWT + bcrypt
- CRUD completo de notas con editor enriquecido (negrita, cursiva, listas, colores, encabezados)
- Onboarding de perfil: nombre, foto de avatar, tipo de usuario
- Panel de notas con menú contextual (renombrar, compartir, eliminar)
- Vista calendario con notas por día y entrada inline
- Proyectos para organizar notas
- Exportación a PDF con html2pdf (descarga directa)
- Corrector ortográfico integrado (nspell + diccionario español)
- Colaboración en tiempo real con Yjs + WebRTC
- Página de nota completa estilo Google Docs con barra de herramientas
- Notificaciones locales con panel de alertas
- Modal de configuración de perfil
- Barra de búsqueda de notas
- Diseño responsive con glassmorphism
- Gradientes animados que siguen el mouse
- Auto-scroll suave y transiciones

## Tecnologías

### Frontend
- HTML5 + Tailwind CSS (CDN)
- JavaScript Vanilla (ES modules)
- Google Material Symbols
- contenteditable + document.execCommand
- html2pdf.js — generación de PDF
- Yjs + y-webrtc — colaboración P2P en tiempo real

### Backend
- Node.js + Express.js
- SQLite (better-sqlite3)
- bcrypt — hash de contraseñas
- JSON Web Token (JWT) — autenticación
- CORS + dotenv + nodemon

## Estructura

```text
Neat!/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── notes.controller.js
│   ├── database/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── notes.routes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── notes.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── onboarding.html
│   ├── dashboard.html
│   └── collab.html
├── .gitignore
├── package.json
└── README.md
```

## Instalación

```bash
git clone <repo>
cd Neat
npm install
```

Esto instala las dependencias del backend y crea automáticamente el archivo `.env`.

```env
PORT=3000
JWT_SECRET=educational_secret_key_change_this
```

## Ejecución

```bash
npm start        # producción
npm run dev      # desarrollo con nodemon + recarga automática
```

Abrir en:

```text
http://localhost:3000
```

### Páginas

```text
/                  → Landing page
/register.html     → Crear cuenta
/login.html        → Iniciar sesión
/onboarding.html   → Configurar perfil (post-registro)
/dashboard.html    → Panel principal de notas
/collab.html       → Vista compartida (colaboración)
```

## API REST

### Públicas
```text
POST /api/auth/register
POST /api/auth/login
```

### Protegidas (JWT)
```text
GET    /api/notes
GET    /api/notes/:id
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id
```

Autenticación:

```text
Authorization: Bearer <token>
```

## Base de datos

SQLite local (`backend/database/noty.sqlite`). Al iniciar se crean automáticamente las tablas `users` y `notes`.

## Colaboración en tiempo real

Cuando abres una nota desde el dashboard, el editor se conecta a una sala WebRTC (`note-{id}`) usando Yjs. Todos los usuarios con la misma nota abierta ven los cambios en vivo. No requiere servidor WebSocket propio — usa señalización pública.

Para compartir una nota, usa el menú de 3 puntos → "Compartir" y envía el enlace.

## Flujo de uso

1. Registro en `/register.html`
2. Inicio de sesión → redirige a `/onboarding.html`
3. Configurar nombre, foto de perfil y tipo de usuario
4. Dashboard: crear, editar, buscar, organizar notas
5. Menú contextual en cada nota: renombrar, compartir, eliminar
6. Click en "Pantalla completa" en el editor → abre vista Google Docs
7. Vista calendario para notas con fecha
8. Proyectos para agrupar notas relacionadas

