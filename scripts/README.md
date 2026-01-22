# 🚀 Scripts de Despliegue - Método Marchant

> **Nota**: Este proyecto utiliza **GitHub Actions** para automatizar todos los despliegues. Los workflows están configurados en `.github/workflows/`.

## 📋 Workflows Disponibles

### 1. Setup AWS Infrastructure (`setup-aws-infrastructure.yml`)

**Propósito**: Configuración inicial de la infraestructura AWS (S3 + CloudFront + OAC)

**Cuándo ejecutar**:
- Primera vez que despliegas el proyecto
- Cuando necesitas recrear la infraestructura
- Cuando cambias el nombre del bucket S3

**Qué hace**:
1. ✅ Crea el bucket S3 si no existe (con verificación robusta)
2. ✅ Configura Block Public Access (mejores prácticas de seguridad)
3. ✅ Crea Origin Access Control (OAC) para CloudFront
4. ✅ Crea distribución CloudFront con configuración optimizada
5. ✅ Aplica bucket policy para permitir acceso desde CloudFront
6. ✅ Configura manejo de errores (404/403 → index.html)

**Cómo ejecutar**:
1. Ve a GitHub → **Actions** → **Setup AWS Infrastructure**
2. Haz clic en **Run workflow**
3. Selecciona qué componentes desplegar
4. Haz clic en **Run workflow**

**Output importante**:
- `CLOUDFRONT_DISTRIBUTION_ID`: Cópialo y agrégalo como secret en GitHub

---

### 2. Deploy Frontend (`deploy-frontend.yml`)

**Propósito**: Despliega el frontend a S3 e invalida CloudFront cache

**Cuándo se ejecuta**:
- Automáticamente: Push a `main`/`master` en `src/frontend/**`
- Manualmente: Desde GitHub Actions → **Deploy Frontend to AWS S3 + CloudFront**

**Qué hace**:
1. ✅ Verifica acceso al bucket S3 (con debugging detallado)
2. ✅ Crea el bucket automáticamente si no existe
3. ✅ Build del frontend (React + Vite)
4. ✅ Upload de assets estáticos con cache largo (1 año)
5. ✅ Upload de HTML/JSON con cache corto (no cache)
6. ✅ Invalidación de CloudFront cache

**Características**:
- Verificación robusta de bucket (maneja AccessDenied vs NoSuchBucket)
- Creación automática de bucket si no existe
- Verificación de región del bucket
- Mensajes de error claros y accionables

---

### 3. Deploy Backend (`deploy-backend.yml`)

**Propósito**: Despliega el backend a AWS Lambda usando Serverless Framework

**Cuándo se ejecuta**:
- Automáticamente: Push a `main`/`master` en `src/backend/**`
- Manualmente: Desde GitHub Actions → **Deploy Backend to AWS Lambda**

**Qué hace**:
1. ✅ Build del backend (NestJS + TypeScript)
2. ✅ Deploy a Lambda usando Serverless Framework
3. ✅ Configura variables de entorno (sin variables reservadas)
4. ✅ Configura permisos IAM para SES

**Características**:
- No pasa variables reservadas de Lambda (AWS_REGION, AWS_ACCESS_KEY_ID, etc.)
- Permisos IAM configurados automáticamente para SES
- Logging estructurado (JSON en producción, coloreado en desarrollo)

---

## 🔑 Secrets Requeridos

Consulta `GITHUB_SECRETS.md` para la lista completa de secrets necesarios.

**Mínimos requeridos**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `VITE_API_URL`

**Opcionales**:
- `CLOUDFRONT_DISTRIBUTION_ID` (se obtiene después del setup inicial)
- `DOMAIN_NAME` (para dominio personalizado)
- `ACM_CERTIFICATE_ARN` (para SSL personalizado)

---

## 🎓 Aprendizajes Clave

### 1. Verificación de Bucket S3

**Problema**: AWS a veces devuelve "Access Denied" en lugar de "NoSuchBucket" por seguridad.

**Solución**: Verificación robusta que:
- Intenta múltiples métodos de verificación
- Distingue entre "bucket no existe" vs "sin permisos"
- Proporciona mensajes de error claros y accionables

### 2. Creación Automática de Bucket

**Problema**: El bucket puede no existir en el primer deploy.

**Solución**: Los workflows verifican y crean el bucket automáticamente si no existe.

### 3. Variables Reservadas de Lambda

**Problema**: Lambda no permite configurar `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` como variables de entorno.

**Solución**: Estas variables se obtienen automáticamente del runtime de Lambda. No se pasan en `serverless.yml`.

### 4. Origin Access Control (OAC)

**Problema**: OAI (Origin Access Identity) está deprecado.

**Solución**: Usar OAC (Origin Access Control) que es más moderno y seguro.

### 5. Verificación de Región

**Problema**: El bucket puede estar en una región diferente a la esperada.

**Solución**: Los workflows detectan y verifican la región del bucket automáticamente.

---

## 🔧 Troubleshooting

### Error: "Access Denied" al desplegar a S3

**Causas posibles**:
1. El bucket no existe → El workflow lo creará automáticamente
2. El bucket está en otra región → Verifica la región en AWS Console
3. Permisos IAM insuficientes → Verifica que tengas `AmazonS3FullAccess` o permisos específicos
4. Bucket policy bloqueando acceso → Verifica la política del bucket

**Solución**: El workflow ahora proporciona debugging detallado que indica exactamente qué está fallando.

### Error: "Bucket name already exists globally"

**Causa**: Los nombres de bucket S3 deben ser únicos en todo AWS.

**Solución**: Elige un nombre diferente y actualiza el secret `S3_BUCKET_NAME`.

### Error: "Lambda was unable to configure your environment variables because the environment variables you have provided contains reserved keys"

**Causa**: Intentaste pasar variables reservadas de Lambda.

**Solución**: Ya está corregido. El workflow no pasa variables reservadas.

### CloudFront tarda mucho en desplegarse

**Normal**: CloudFront puede tardar 15-20 minutos en desplegarse completamente.

**Verificación**: 
```bash
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID --query 'Distribution.Status'
```

---

## 📚 Documentación Relacionada

- `GITHUB_SECRETS.md`: Configuración completa de secrets
- `ENV_TEMPLATE.md`: Variables de entorno locales
- `README.md`: Documentación general del proyecto
- `QUICK_START.md`: Guía de inicio rápido

---

## 🚀 Flujo de Trabajo Recomendado

### Primera Vez (Setup Inicial)

1. **Configurar GitHub Secrets**:
   - Ve a Settings → Secrets and variables → Actions
   - Agrega todos los secrets requeridos (ver `GITHUB_SECRETS.md`)

2. **Ejecutar Setup de Infraestructura**:
   - Ve a Actions → **Setup AWS Infrastructure**
   - Ejecuta el workflow manualmente
   - Copia el `CLOUDFRONT_DISTRIBUTION_ID` de los logs
   - Agrégalo como secret en GitHub

3. **Verificar Despliegue**:
   - Haz push a `main` para desplegar frontend y backend
   - O ejecuta los workflows manualmente

### Despliegues Subsecuentes

Simplemente haz push a `main` o `master`:
- Cambios en `src/frontend/**` → Deploy automático de frontend
- Cambios en `src/backend/**` → Deploy automático de backend

---

## 💡 Mejores Prácticas

1. **Siempre verifica los logs** del workflow si algo falla
2. **No hardcodees secrets** en el código
3. **Usa nombres de bucket únicos** (pueden incluir tu nombre o proyecto)
4. **Mantén los secrets actualizados** (rota credenciales periódicamente)
5. **Revisa los permisos IAM** si hay errores de acceso

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del workflow en GitHub Actions
2. Verifica que todos los secrets estén configurados
3. Consulta `GITHUB_SECRETS.md` para troubleshooting detallado
4. Verifica los permisos IAM en AWS Console
