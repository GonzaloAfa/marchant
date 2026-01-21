# 🔐 GitHub Secrets - Configuración Requerida

Este documento lista todos los secrets que debes configurar en GitHub para que los workflows de despliegue funcionen correctamente.

## 📍 Ubicación

Ve a tu repositorio en GitHub:
1. **Settings** → **Secrets and variables** → **Actions**
2. Haz clic en **New repository secret**
3. Agrega cada secret con su nombre y valor

---

## 🔑 Secrets Requeridos

### AWS Credentials (Obligatorios)

#### `AWS_ACCESS_KEY_ID`
- **Descripción**: Access Key ID de AWS IAM
- **Cómo obtenerlo**:
  1. Ve a AWS Console → IAM → Users → Tu usuario → Security credentials
  2. Crea un nuevo Access Key
  3. Copia el Access Key ID
- **Permisos necesarios**: Ver sección [Permisos IAM](#permisos-iam-requeridos) abajo

#### `AWS_SECRET_ACCESS_KEY`
- **Descripción**: Secret Access Key de AWS IAM
- **Cómo obtenerlo**: Se muestra solo una vez al crear el Access Key. Guárdalo de forma segura.
- **⚠️ Importante**: Si lo pierdes, deberás crear uno nuevo

---

### AWS Infrastructure (Obligatorios)

#### `S3_BUCKET_NAME`
- **Descripción**: Nombre del bucket S3 donde se desplegará el frontend
- **Ejemplo**: `marchant-frontend` o `marchant-web`
- **Requisitos**:
  - Debe ser único globalmente en AWS
  - Solo letras minúsculas, números y guiones
  - No puede empezar ni terminar con guión
- **Nota**: El workflow creará el bucket automáticamente si no existe

#### `CLOUDFRONT_DISTRIBUTION_ID`
- **Descripción**: ID de la distribución CloudFront (se genera automáticamente)
- **Cómo obtenerlo**:
  - Se genera automáticamente al ejecutar el workflow `setup-aws-infrastructure.yml`
  - O manualmente: AWS Console → CloudFront → Copia el Distribution ID
- **Nota**: Si ejecutas el workflow de setup, este ID se mostrará en los logs. Cópialo y agrégalo como secret.

---

### Backend Configuration (Obligatorios)

#### `MONGODB_URI`
- **Descripción**: URI de conexión a MongoDB
- **Formato**: `mongodb+srv://username:password@cluster.mongodb.net/marchant?retryWrites=true&w=majority`
- **Cómo obtenerlo**:
  1. Ve a MongoDB Atlas → Clusters
  2. Haz clic en "Connect"
  3. Selecciona "Connect your application"
  4. Copia la connection string
  5. Reemplaza `<password>` con tu contraseña

#### `JWT_SECRET`
- **Descripción**: Secret key para firmar tokens JWT
- **Cómo generarlo**:
  ```bash
  openssl rand -base64 32
  ```
- **Requisitos**: Mínimo 32 caracteres, debe ser aleatorio y seguro

#### `FRONTEND_URL`
- **Descripción**: URL pública del frontend (para links en emails)
- **Ejemplos**:
  - `https://marchant.com` (si tienes dominio)
  - `https://d1234567890.cloudfront.net` (URL de CloudFront)
- **Nota**: Debe ser HTTPS en producción

---

### Backend Configuration (Opcionales)

#### `JWT_EXPIRES_IN`
- **Descripción**: Tiempo de expiración de tokens JWT
- **Default**: `24h`
- **Ejemplos**: `1h`, `7d`, `30d`

#### `FROM_EMAIL`
- **Descripción**: Email desde el cual se enviarán los emails
- **Default**: `noreply@marchant.com`
- **⚠️ Importante**: Debe estar verificado en AWS SES antes de enviar emails

#### `ALLOWED_ORIGINS`
- **Descripción**: Orígenes permitidos para CORS (separados por coma)
- **Ejemplo**: `https://marchant.com,https://www.marchant.com`
- **Default**: Vacío (se usan valores por defecto)

#### `LOG_LEVEL`
- **Descripción**: Nivel de logging
- **Valores**: `error`, `warn`, `info`, `debug`
- **Default**: `info`

---

### Frontend Configuration (Opcional)

#### `VITE_API_URL`
- **Descripción**: URL de la API backend (se inyecta en el build)
- **Ejemplo**: `https://api.marchant.com/api/v1`
- **Nota**: Si no se proporciona, se usa un valor por defecto

---

### Domain & SSL (Opcionales)

#### `DOMAIN_NAME`
- **Descripción**: Dominio personalizado para CloudFront
- **Ejemplo**: `marchant.com` o `www.marchant.com`
- **Nota**: Solo necesario si quieres usar un dominio personalizado

#### `ACM_CERTIFICATE_ARN`
- **Descripción**: ARN del certificado SSL en AWS Certificate Manager
- **Formato**: `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`
- **Cómo obtenerlo**:
  1. Ve a AWS Certificate Manager (ACM) en región **us-east-1**
  2. Solicita un certificado público para tu dominio
  3. Valida el certificado (DNS o email)
  4. Copia el ARN del certificado
- **⚠️ Importante**: El certificado debe estar en la región **us-east-1** (requerido por CloudFront)

---

## 🔐 Permisos IAM Requeridos

El usuario IAM asociado a las credenciales debe tener los siguientes permisos:

### Política Mínima Recomendada

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "cloudfront:*",
        "lambda:*",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy",
        "iam:PassRole",
        "apigateway:*",
        "logs:*",
        "ses:SendEmail",
        "ses:SendRawEmail",
        "acm:ListCertificates",
        "acm:DescribeCertificate"
      ],
      "Resource": "*"
    }
  ]
}
```

### Política Más Restrictiva (Recomendada para Producción)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:PutBucketPublicAccessBlock",
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::marchant-*",
        "arn:aws:s3:::marchant-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateDistribution",
        "cloudfront:GetDistribution",
        "cloudfront:UpdateDistribution",
        "cloudfront:ListDistributions",
        "cloudfront:CreateInvalidation",
        "cloudfront:CreateOriginAccessControl",
        "cloudfront:GetOriginAccessControl",
        "cloudfront:ListOriginAccessControls"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:GetFunction",
        "lambda:ListFunctions",
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:*:*:function:marchant-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy",
        "iam:PassRole",
        "iam:GetRole"
      ],
      "Resource": "arn:aws:iam::*:role/marchant-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:*"
      ],
      "Resource": "arn:aws:apigateway:*::/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/aws/lambda/marchant-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 📋 Checklist de Configuración

### Primera Vez (Setup Inicial)

- [ ] Crear usuario IAM en AWS con los permisos necesarios
- [ ] Generar Access Key y Secret Key
- [ ] Agregar `AWS_ACCESS_KEY_ID` a GitHub Secrets
- [ ] Agregar `AWS_SECRET_ACCESS_KEY` a GitHub Secrets
- [ ] Agregar `S3_BUCKET_NAME` a GitHub Secrets
- [ ] Agregar `MONGODB_URI` a GitHub Secrets
- [ ] Agregar `JWT_SECRET` a GitHub Secrets
- [ ] Agregar `FRONTEND_URL` a GitHub Secrets
- [ ] (Opcional) Agregar `DOMAIN_NAME` si usas dominio personalizado
- [ ] (Opcional) Agregar `ACM_CERTIFICATE_ARN` si usas SSL personalizado
- [ ] Ejecutar workflow `setup-aws-infrastructure.yml` manualmente
- [ ] Copiar `CLOUDFRONT_DISTRIBUTION_ID` de los logs y agregarlo como secret
- [ ] Verificar que el frontend se despliega correctamente
- [ ] Verificar que el backend se despliega correctamente

---

## 🚀 Uso de los Workflows

### Setup Inicial (Primera Vez)

1. Ve a **Actions** → **Setup AWS Infrastructure**
2. Haz clic en **Run workflow**
3. Selecciona qué componentes desplegar:
   - ✅ Setup infrastructure
   - ✅ Deploy frontend
   - ✅ Deploy backend
4. Haz clic en **Run workflow**
5. Espera a que termine y copia el `CLOUDFRONT_DISTRIBUTION_ID` de los logs
6. Agrega `CLOUDFRONT_DISTRIBUTION_ID` como secret

### Despliegues Automáticos

Los workflows `deploy-frontend.yml` y `deploy-backend.yml` se ejecutan automáticamente cuando:
- Se hace push a `main` o `master`
- Se cambian archivos en `src/frontend/` o `src/backend/`

### Despliegues Manuales

Puedes ejecutar cualquier workflow manualmente desde **Actions** → Selecciona el workflow → **Run workflow**

---

## 🔒 Seguridad

### Buenas Prácticas

1. **Nunca commits secrets**: Los secrets nunca deben estar en el código
2. **Rotar credenciales**: Rota las credenciales de AWS periódicamente
3. **Principio de menor privilegio**: Usa permisos IAM mínimos necesarios
4. **Revisar logs**: Revisa los logs de GitHub Actions regularmente
5. **Usar secretos específicos**: No uses el mismo secret para múltiples proyectos

### En Caso de Compromiso

Si sospechas que tus credenciales fueron comprometidas:

1. **Inmediatamente**: Ve a AWS IAM y desactiva/elimina el Access Key comprometido
2. **Crea nuevas credenciales**: Genera un nuevo Access Key
3. **Actualiza GitHub Secrets**: Reemplaza los secrets en GitHub
4. **Revisa actividad**: Revisa los logs de CloudTrail en AWS para actividad sospechosa

---

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa los logs del workflow en GitHub Actions
2. Verifica que todos los secrets estén configurados correctamente
3. Verifica los permisos IAM del usuario
4. Consulta la documentación de AWS para cada servicio
