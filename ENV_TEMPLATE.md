# Template de Variables de Entorno

Copia este contenido a un archivo `.env` en la raíz del proyecto.

```env
# ============================================
# MÉTODO MARCHANT - VARIABLES DE ENTORNO
# ============================================
# Copia este archivo a .env y configura tus valores
# cp ENV_TEMPLATE.md .env (y edita el contenido)

# ============================================
# GENERAL
# ============================================
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# ============================================
# DATABASE
# ============================================
# MongoDB Local (Docker)
MONGODB_URI=mongodb://localhost:27017/marchant

# MongoDB Atlas (Producción)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marchant?retryWrites=true&w=majority

# ============================================
# AUTHENTICATION
# ============================================
# Genera un secret seguro: openssl rand -base64 32
JWT_SECRET=change-this-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=24h

# ============================================
# EXTERNAL SERVICES
# ============================================

# AWS SES (Email) - Opcional: si no está, los emails se imprimen en consola
# Configurar en AWS Console: https://console.aws.amazon.com/ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
FROM_EMAIL=noreply@marchant.com
# Nota: FROM_EMAIL debe estar verificado en AWS SES antes de enviar emails

# ============================================
# FRONTEND
# ============================================
# URL del frontend (para links en emails)
FRONTEND_URL=http://localhost:3001

# URL de la API backend (para el frontend)
# En desarrollo, Vite usa esta variable automáticamente
# En producción, se configura en el build
VITE_API_URL=http://localhost:3000/api/v1

# ============================================
# AWS (Solo para producción - GitHub Actions)
# ============================================
# Configurar en GitHub Secrets, no aquí
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# S3_BUCKET_NAME=marchant-frontend
# CLOUDFRONT_DISTRIBUTION_ID=
# LAMBDA_FUNCTION_NAME=marchant-backend
```
