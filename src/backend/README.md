# Backend - Método Marchant API

## 🚀 Stack Tecnológico

- **NestJS** - Framework Node.js
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación
- **OpenAI** - Servicios de IA
- **Serverless Ready** - Vercel/Netlify/AWS Lambda

---

## 📦 Instalación

```bash
npm install
```

---

## ⚙️ Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
# App
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# MongoDB
MONGODB_URI=mongodb://localhost:27017/marchant
# O MongoDB Atlas (recomendado para producción):
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/marchant

# JWT
JWT_SECRET=tu-secret-key-super-seguro
JWT_EXPIRES_IN=24h

# OpenAI (opcional)
OPENAI_API_KEY=tu-api-key
```

---

## 🗄️ MongoDB Setup

### Opción 1: MongoDB Local (Docker)

```bash
docker run --name marchant-mongo \
  -e MONGO_INITDB_DATABASE=marchant \
  -p 27017:27017 \
  -d mongo:7
```

### Opción 2: MongoDB Atlas (Recomendado para Producción)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito
3. Obtener connection string
4. Agregar a `MONGODB_URI` en `.env`

---

## 🏃 Desarrollo Local

```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run build
npm run start:prod
```

API disponible en: `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

---

## ☁️ Deploy Serverless

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

**Configurar variables de entorno en Vercel Dashboard:**
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `ALLOWED_ORIGINS`

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### AWS Lambda

Usar [Serverless Framework](https://www.serverless.com/) o [AWS SAM](https://aws.amazon.com/serverless/sam/)

---

## 📁 Estructura

```
src/
├── main.ts                 # Entry point (local)
├── serverless.ts          # Entry point (serverless)
├── app.module.ts          # Módulo principal
├── models/                # Schemas de MongoDB
│   ├── user.schema.ts
│   ├── student.schema.ts
│   └── diagnosis.schema.ts
├── modules/               # Módulos de features
│   ├── auth/
│   ├── students/
│   └── diagnosis/
└── services/              # Servicios compartidos
    └── ai/
```

---

## 🔧 Características Serverless

✅ **Stateless**: Sin estado en memoria
✅ **Cold Start Optimizado**: Conexión MongoDB reutilizada
✅ **Environment Variables**: Configuración vía variables de entorno
✅ **CORS Configurado**: Para frontend en diferentes dominios
✅ **Swagger**: Solo en desarrollo (deshabilitado en producción)

---

## 📝 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión

### Estudiantes
- `GET /api/v1/students/me` - Info del estudiante
- `GET /api/v1/students/me/progress` - Progreso

### Diagnóstico
- `POST /api/v1/diagnosis/start` - Iniciar diagnóstico
- `POST /api/v1/diagnosis/:id/answer` - Responder pregunta
- `POST /api/v1/diagnosis/:id/complete` - Completar diagnóstico

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 📚 Documentación

- Swagger UI: `http://localhost:3000/api/docs` (solo desarrollo)
- API Spec: Ver `architecture/api-specification.md`

---

## 🚨 Troubleshooting

### Error: MongoDB connection
- Verificar que MongoDB esté corriendo
- Verificar `MONGODB_URI` en `.env`
- Verificar firewall/red en MongoDB Atlas

### Error: Cold start lento
- Normal en serverless (primera invocación)
- Considerar MongoDB Atlas (más rápido que local)
- Usar connection pooling

### Error: CORS
- Verificar `ALLOWED_ORIGINS` en variables de entorno
- Agregar dominio del frontend

---

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] MongoDB Atlas configurado (o MongoDB local accesible)
- [ ] `JWT_SECRET` seguro y único
- [ ] `ALLOWED_ORIGINS` con dominios correctos
- [ ] Tests pasando
- [ ] Build exitoso (`npm run build`)
