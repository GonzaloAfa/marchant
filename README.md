# Método Marchant - Sistema Operativo para Producción de Capital Académico

> Plataforma digital escalable para acompañamiento integral en desarrollo de tesis, trabajos de grado e investigaciones académicas en Latinoamérica.

## 🎯 Visión

No somos una "plataforma de tesis". Somos el **Sistema Operativo para la Producción de Capital Académico y Profesional en Latinoamérica**.

Método Marchant combina:
- ✅ **Rigor académico** con **apoyo psicoemocional**
- ✅ **Automatización inteligente** con **coaching personalizado**
- ✅ **Tecnología de punta** con **metodología probada**

## 🏗️ Estructura del Proyecto

```
marchant/
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml      # Deploy backend a AWS Lambda
│       └── deploy-frontend.yml     # Deploy frontend a S3 + CloudFront
├── architecture/                   # Arquitectura técnica
│   ├── system-design.md
│   ├── api-specification.md
│   ├── database-schema.md
│   └── python-vs-nodejs-analysis.md
├── docs/                          # Documentación estratégica
│   ├── business-blueprint.md
│   ├── product-roadmap.md
│   ├── monetization-strategy.md
│   ├── user-experience-maps.md
│   ├── automation-framework.md
│   ├── growth-strategy.md
│   └── ip-protection.md
├── pitch/                         # Materiales de presentación
│   └── elevator-pitch.md
├── src/
│   ├── backend/                   # Node.js + Nest.js + MongoDB
│   │   ├── src/
│   │   │   ├── modules/           # Módulos de la aplicación
│   │   │   │   ├── auth/          # Autenticación JWT
│   │   │   │   ├── students/     # Gestión de estudiantes
│   │   │   │   ├── diagnosis/     # Diagnóstico inicial
│   │   │   │   └── leads/         # Captura de leads
│   │   │   ├── models/            # Schemas MongoDB (Mongoose)
│   │   │   ├── services/          # Servicios (AI, Email)
│   │   │   ├── database/          # Configuración MongoDB
│   │   │   └── main.ts            # Entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── serverless.ts         # Configuración serverless
│   └── frontend/                  # React + TypeScript + Vite
│       ├── src/
│       │   ├── components/       # Atomic Design
│       │   │   ├── atoms/
│       │   │   ├── molecules/
│       │   │   ├── organisms/
│       │   │   └── templates/
│       │   ├── pages/             # Páginas (Home, Diagnosis)
│       │   ├── services/          # API services
│       │   └── App.tsx
│       ├── package.json
│       └── vite.config.ts
├── .env                           # Variables de entorno (local)
├── .env.example                   # Template de variables de entorno
├── .gitignore
└── README.md                      # Este archivo
```

## 🚀 Instalación y Setup

### Prerrequisitos

- **Node.js** >= 18.x
- **npm** o **yarn**
- **MongoDB** (local o MongoDB Atlas)
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/marchant.git
cd marchant
```

### 2. Configurar Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto y configura tus variables:

```bash
# Opción 1: Usar el template
cat ENV_TEMPLATE.md | grep -v "^#" | grep -v "^$" | grep "=" > .env

# Opción 2: Crear manualmente
touch .env
```

Edita `.env` con tus valores (ver sección [Variables de Entorno](#-variables-de-entorno) abajo o el archivo `ENV_TEMPLATE.md`).

### 3. Instalar Dependencias

#### Backend

```bash
cd src/backend
npm install
```

#### Frontend

```bash
cd src/frontend
npm install
```

### 4. Configurar MongoDB

#### Opción A: MongoDB Local (Docker)

```bash
docker run --name marchant-mongo \
  -e MONGO_INITDB_DATABASE=marchant \
  -p 27017:27017 \
  -d mongo:7
```

#### Opción B: MongoDB Atlas (Recomendado para Producción)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito (M0)
3. Crear usuario de base de datos
4. Whitelist IP (0.0.0.0/0 para desarrollo)
5. Obtener connection string y agregarlo a `.env` como `MONGODB_URI`

### 5. Ejecutar en Desarrollo

#### Terminal 1: Backend

```bash
cd src/backend
npm run start:dev
```

Backend estará en: `http://localhost:3000`
- API: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/api/docs`

#### Terminal 2: Frontend

```bash
cd src/frontend
npm run dev
```

Frontend estará en: `http://localhost:3001`

## 📦 Variables de Entorno

Todas las variables de entorno se configuran en el archivo `.env` en la raíz del proyecto.

### Variables Generales

| Variable | Descripción | Requerido | Default | Ejemplo |
|----------|-------------|-----------|---------|---------|
| `NODE_ENV` | Ambiente de ejecución | No | `development` | `development`, `production` |
| `PORT` | Puerto del backend | No | `3000` | `3000` |
| `ALLOWED_ORIGINS` | Orígenes permitidos (CORS), separados por coma | No | `http://localhost:3000,http://localhost:3001` | `http://localhost:3001,https://marchant.com` |

### Base de Datos

| Variable | Descripción | Requerido | Default | Ejemplo |
|----------|-------------|-----------|---------|---------|
| `MONGODB_URI` | Connection string de MongoDB | **Sí** | - | `mongodb://localhost:27017/marchant` o `mongodb+srv://user:pass@cluster.mongodb.net/marchant` |

### Autenticación

| Variable | Descripción | Requerido | Default | Ejemplo |
|----------|-------------|-----------|---------|---------|
| `JWT_SECRET` | Secret key para JWT tokens | **Sí** | - | `tu-secret-key-super-seguro-minimo-32-caracteres` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | No | `24h` | `24h`, `7d`, `30d` |

### Servicios Externos

#### AWS SES (Email)

| Variable | Descripción | Requerido | Default | Ejemplo |
|----------|-------------|-----------|---------|---------|
| `AWS_REGION` | Región de AWS para SES | No* | `us-east-1` | `us-east-1`, `us-west-2` |
| `AWS_ACCESS_KEY_ID` | Access Key ID de AWS | No* | - | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret Access Key de AWS | No* | - | `xxxxx` |
| `FROM_EMAIL` | Email remitente (debe estar verificado en SES) | No | `noreply@marchant.com` | `noreply@marchant.com` |

*Opcional: Si no está configurado, los emails se imprimirán en consola (modo desarrollo).

**Nota**: El email remitente (`FROM_EMAIL`) debe estar verificado en AWS SES antes de poder enviar emails.

### Frontend

| Variable | Descripción | Requerido | Default | Ejemplo |
|----------|-------------|-----------|---------|---------|
| `FRONTEND_URL` | URL del frontend (para links en emails) | No | `http://localhost:3001` | `https://marchant.com` |
| `VITE_API_URL` | URL de la API backend | No | `http://localhost:3000/api/v1` | `https://api.marchant.com/api/v1` |

**Nota**: Las variables `VITE_*` deben configurarse en el frontend para build-time. En desarrollo, Vite las lee automáticamente. En producción, se configuran en el CI/CD.

### AWS (Producción)

| Variable | Descripción | Requerido | Default | Ejemplo |
|----------|-------------|-----------|---------|---------|
| `AWS_REGION` | Región de AWS | Sí (prod) | - | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Access Key ID de AWS | Sí (prod) | - | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret Access Key de AWS | Sí (prod) | - | `xxxxx` |
| `S3_BUCKET_NAME` | Nombre del bucket S3 para frontend | Sí (prod) | - | `marchant-frontend` |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de distribución CloudFront | Sí (prod) | - | `E1234567890ABC` |
| `LAMBDA_FUNCTION_NAME` | Nombre de la función Lambda | Sí (prod) | - | `marchant-backend` |

### Ejemplo de `.env` Completo

```env
# ============================================
# GENERAL
# ============================================
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# ============================================
# DATABASE
# ============================================
MONGODB_URI=mongodb://localhost:27017/marchant
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/marchant?retryWrites=true&w=majority

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=tu-secret-key-super-seguro-minimo-32-caracteres-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# ============================================
# EXTERNAL SERVICES
# ============================================
# AWS SES (Email) - Opcional: si no está, emails se imprimen en consola
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxxxx
FROM_EMAIL=noreply@marchant.com
# Nota: FROM_EMAIL debe estar verificado en AWS SES

# ============================================
# FRONTEND
# ============================================
FRONTEND_URL=http://localhost:3001
VITE_API_URL=http://localhost:3000/api/v1

# ============================================
# AWS (Solo para producción)
# ============================================
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=AKIA...
# AWS_SECRET_ACCESS_KEY=xxxxx
# S3_BUCKET_NAME=marchant-frontend
# CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
# LAMBDA_FUNCTION_NAME=marchant-backend
```

## 🏗️ Pilares del Método

1. **Diagnóstico Inicial y de Viabilidad** - Evaluación completa del estado del proyecto
2. **Estructuración Lógica** - Organización y coherencia del trabajo
3. **Apoyo Psicoemocional** - Gestión de ansiedad y bloqueos
4. **Resultados y Análisis** - Análisis profundo de contenido
5. **Blindaje Académico** - Prevención de plagio y citación correcta
6. **Coaching para Defensa Oral** - Preparación para presentación

## 🚀 Deploy a AWS

El proyecto incluye GitHub Actions para deploy automático a AWS:

- **Frontend**: S3 + CloudFront
- **Backend**: AWS Lambda (serverless)
- **Base de Datos**: MongoDB Atlas (recomendado)

### Configurar GitHub Secrets

En tu repositorio de GitHub, ve a **Settings > Secrets and variables > Actions** y agrega:

#### Secrets Requeridos

- `AWS_ACCESS_KEY_ID` - Access Key ID de AWS
- `AWS_SECRET_ACCESS_KEY` - Secret Access Key de AWS
- `MONGODB_URI` - Connection string de MongoDB Atlas
- `JWT_SECRET` - Secret key para JWT

#### Secrets de AWS (Opcionales - se pueden configurar en el workflow)

- `AWS_REGION` - Región de AWS (default: `us-east-1`)
- `S3_BUCKET_NAME` - Nombre del bucket S3
- `CLOUDFRONT_DISTRIBUTION_ID` - ID de distribución CloudFront
- `LAMBDA_FUNCTION_NAME` - Nombre de la función Lambda

### Deploy Automático

Los workflows se ejecutan automáticamente cuando:
- **Frontend**: Push a `main` o `master`
- **Backend**: Push a `main` o `master`

También puedes ejecutarlos manualmente desde **Actions** en GitHub.

## 📚 Documentación Adicional

- **Quick Start**: Ver `QUICK_START.md`
- **Arquitectura**: Ver `architecture/system-design.md`
- **API Specification**: Ver `architecture/api-specification.md`
- **Estrategia de Negocio**: Ver `docs/business-blueprint.md`
- **Roadmap**: Ver `docs/product-roadmap.md`

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + **Nest.js** + **TypeScript**
- **MongoDB** (Mongoose)
- **JWT** para autenticación
- **AWS SES** para emails
- **Serverless-ready** (AWS Lambda)

### Frontend
- **React** + **TypeScript** + **Vite**
- **Atomic Design** (atoms, molecules, organisms, templates)
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Framer Motion** para animaciones

## 📝 Scripts Disponibles

### Backend

```bash
cd src/backend

npm run start          # Iniciar en producción
npm run start:dev      # Iniciar en desarrollo (watch mode)
npm run build          # Compilar TypeScript
npm run test           # Ejecutar tests
npm run lint           # Linter
```

### Frontend

```bash
cd src/frontend

npm run dev            # Iniciar en desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
npm run lint           # Linter
```

## 🧪 Testing

```bash
# Backend
cd src/backend
npm test

# Frontend
cd src/frontend
npm test
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

---

**Status**: 🟢 En Desarrollo Activo
**Versión**: 0.1.0
**Última Actualización**: 2024
