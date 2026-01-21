# 🚀 Quick Start - Método Marchant

## ✅ Lo que acabamos de crear

1. **Backend Node.js/Nest.js + MongoDB** - API serverless-ready
2. **Landing Page React** - Página de inicio profesional

---

## 📦 Instalación y Setup

### Backend (Node.js/Nest.js + MongoDB)

```bash
cd src/backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
# (MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, etc.)

# Desarrollo
npm run start:dev

# La API estará en http://localhost:3000
# Swagger docs en http://localhost:3000/api/docs
```

### Frontend (React)

```bash
cd src/frontend

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# El frontend estará en http://localhost:3001
```

---

## 🗄️ Setup MongoDB

### Opción 1: Docker (Local - Más Fácil)

```bash
docker run --name marchant-mongo \
  -e MONGO_INITDB_DATABASE=marchant \
  -p 27017:27017 \
  -d mongo:7
```

### Opción 2: MongoDB Atlas (Recomendado para Producción)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito (M0 - Free tier)
3. Crear usuario de base de datos
4. Whitelist IP (0.0.0.0/0 para desarrollo)
5. Obtener connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/marchant?retryWrites=true&w=majority
   ```
6. Agregar a `.env` como `MONGODB_URI`

---

## 🎯 Próximos Pasos Inmediatos

### 1. Configurar Variables de Entorno

**Backend** (`src/backend/.env`):
```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# MongoDB (Docker local)
MONGODB_URI=mongodb://localhost:27017/marchant

# O MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/marchant

# JWT
JWT_SECRET=tu-secret-key-super-seguro-aqui-minimo-32-caracteres
JWT_EXPIRES_IN=24h

# OpenAI (opcional por ahora)
OPENAI_API_KEY=tu-api-key
```

### 2. Probar el Frontend

```bash
cd src/frontend
npm install
npm run dev
```

Abre http://localhost:3001 y verás:
- ✅ Hero section con CTAs
- ✅ Sección de problema/solución
- ✅ Los 6 pilares del método
- ✅ Formulario de diagnóstico básico

### 3. Probar el Backend

```bash
cd src/backend
npm install
npm run start:dev
```

Abre http://localhost:3000/api/docs para ver Swagger UI

---

## 🔧 Estructura Creada

### Backend (`src/backend/`)
```
src/
├── main.ts                 # Entry point (local)
├── serverless.ts          # Entry point (serverless)
├── app.module.ts          # Módulo principal
├── models/                # Schemas MongoDB
│   ├── user.schema.ts
│   ├── student.schema.ts
│   └── diagnosis.schema.ts
├── modules/
│   ├── auth/             # Autenticación (JWT)
│   ├── students/         # Estudiantes
│   └── diagnosis/        # Diagnóstico (Pilar 1)
├── services/
│   └── ai/               # Servicio de IA (OpenAI)
└── database/             # Configuración MongoDB
```

### Frontend (`src/frontend/`)
```
src/
├── pages/
│   ├── Home.tsx          # Página principal
│   └── Diagnosis.tsx     # Formulario diagnóstico
├── App.tsx
└── main.tsx
```

---

## ☁️ Deploy Serverless (Vercel)

### Backend

```bash
cd src/backend

# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard:
# - MONGODB_URI
# - JWT_SECRET
# - OPENAI_API_KEY
# - ALLOWED_ORIGINS
```

### Frontend

```bash
cd src/frontend
npm run build

# Deploy a Vercel
vercel
```

---

## 🎨 Características del Frontend

✅ **Diseño Moderno**
- Gradientes y animaciones suaves
- Responsive (mobile-first)
- Tailwind CSS para estilos

✅ **Secciones Incluidas**
- Hero con CTAs claros
- Estadísticas de impacto
- Problema vs Solución
- Los 6 Pilares del Método
- Formulario de diagnóstico interactivo
- Footer completo

---

## 🔌 Conectar Frontend con Backend

### Paso 1: Crear servicio API

Crear `src/frontend/src/services/api.ts`:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api/v1',
});

export const diagnosisService = {
  start: () => api.post('/diagnosis/start'),
  answer: (diagnosisId: string, answer: any) => 
    api.post(`/diagnosis/${diagnosisId}/answer`, answer),
  complete: (diagnosisId: string) => 
    api.post(`/diagnosis/${diagnosisId}/complete`),
};

export default api;
```

### Paso 2: Actualizar Diagnosis.tsx

Conectar el formulario con el backend (ver TODO en el código)

---

## 📝 TODOs Inmediatos

### Backend
- [x] MongoDB + Mongoose configurado
- [x] Schemas creados (User, Student, Diagnosis)
- [ ] Completar lógica de autenticación
- [ ] Conectar diagnóstico con base de datos
- [ ] Integrar OpenAI para análisis de respuestas

### Frontend
- [ ] Conectar formulario con backend API
- [ ] Agregar más preguntas al diagnóstico (15-20)
- [ ] Agregar validación de formulario
- [ ] Integrar con email service (SendGrid)

### General
- [ ] Setup CI/CD básico
- [ ] Agregar tests básicos
- [ ] Configurar dominio y deploy

---

## 🚀 Ventajas de MongoDB + Serverless

✅ **MongoDB**:
- NoSQL flexible para datos académicos
- Escalable horizontalmente
- MongoDB Atlas gratuito (512MB)
- Perfecto para documentos JSON

✅ **Serverless**:
- Sin servidores que mantener
- Escala automáticamente
- Pago por uso
- Deploy rápido (Vercel/Netlify)

---

## 📚 Documentación

- **Backend README**: `src/backend/README.md`
- **Arquitectura**: `architecture/system-design.md`
- **API Spec**: `architecture/api-specification.md`
- **Plan de Acción**: `PLAN_ACCION_INMEDIATO.md`

---

## 🆘 Troubleshooting

### Error: MongoDB connection
```bash
# Verificar que MongoDB esté corriendo
docker ps | grep mongo

# O verificar MongoDB Atlas connection string
```

### Error: Cannot find module
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use
```bash
# Cambiar puerto en .env o matar proceso
lsof -ti:3000 | xargs kill -9
```

---

## ✅ Checklist de Inicio

- [ ] Backend instalado y corriendo (puerto 3000)
- [ ] Frontend instalado y corriendo (puerto 3001)
- [ ] MongoDB configurado (Docker o Atlas)
- [ ] Variables de entorno configuradas
- [ ] Frontend visible en navegador
- [ ] Backend API respondiendo (Swagger docs)
- [ ] Formulario de diagnóstico funcional (frontend)

---

**¡Listo para empezar!** 🎉

Siguiente paso: Conectar el formulario de diagnóstico con el backend y empezar a captar leads.
