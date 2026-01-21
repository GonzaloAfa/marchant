# Código Fuente - Método Marchant

## 🏗️ Estructura del Proyecto

```
src/
├── backend/              # Node.js/Nest.js + MongoDB
│   ├── src/
│   │   ├── modules/      # Módulos de la aplicación
│   │   │   ├── auth/
│   │   │   ├── students/
│   │   │   ├── diagnosis/
│   │   │   └── leads/
│   │   ├── models/       # Schemas MongoDB (Mongoose)
│   │   ├── services/     # Servicios (AI, Email, etc.)
│   │   ├── database/     # Configuración MongoDB
│   │   └── main.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── serverless.ts    # Configuración serverless
├── frontend/            # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/  # Atomic Design (atoms, molecules, organisms, templates)
│   │   ├── pages/       # Páginas (Home, Diagnosis)
│   │   ├── services/    # API services
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── mobile/              # (React Native - futuro)
```

## 🚀 Quick Start

### Backend (Node.js/Nest.js)
```bash
cd src/backend
npm install
npm run start:dev
# La API estará en http://localhost:3000
```

### Frontend (React)
```bash
cd src/frontend
npm install
npm run dev
# El frontend estará en http://localhost:3001
```

## 📝 Stack Tecnológico

- **Backend**: Node.js + Nest.js + TypeScript + MongoDB
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Deploy**: Serverless (Vercel/Netlify ready)

## 📚 Documentación

- Ver `QUICK_START.md` para setup completo
- Ver `architecture/system-design.md` para arquitectura
- Ver `LEAD_CAPTURE_SETUP.md` para sistema de leads
