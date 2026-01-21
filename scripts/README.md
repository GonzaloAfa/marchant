# Scripts de Despliegue AWS

Este directorio contiene scripts para configurar y desplegar la aplicación en AWS (S3 + CloudFront).

## Prerequisitos

1. **AWS CLI instalado y configurado**
   ```bash
   # Instalar AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   
   # Configurar credenciales
   aws configure
   ```

2. **Credenciales de AWS**
   - Access Key ID
   - Secret Access Key
   - Región (por defecto: us-east-1)

3. **Permisos IAM necesarios**
   - `s3:*` (para crear y gestionar buckets)
   - `cloudfront:*` (para crear y gestionar distribuciones)
   - `iam:CreateRole` (si usas roles personalizados)

## Scripts Disponibles

### 1. `setup-aws-infrastructure.sh`

Crea y configura la infraestructura AWS (S3 bucket + CloudFront distribution).

**Uso:**
```bash
chmod +x scripts/setup-aws-infrastructure.sh
./scripts/setup-aws-infrastructure.sh
```

**Variables de entorno:**
- `S3_BUCKET_NAME` (opcional, default: `alisonvivanco-website`)
- `AWS_REGION` (opcional, default: `us-east-1`)
- `DOMAIN_NAME` (opcional, default: `alisonvivanco.cl`)
- `ACM_CERTIFICATE_ARN` (opcional, ARN del certificado SSL en us-east-1)

**Ejemplo:**
```bash
S3_BUCKET_NAME=mi-website \
AWS_REGION=us-east-1 \
DOMAIN_NAME=alisonvivanco.cl \
ACM_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012 \
./scripts/setup-aws-infrastructure.sh
```

**Qué hace:**
1. Crea un bucket S3 si no existe
2. Configura el bucket para hosting estático
3. Aplica políticas de acceso público
4. Crea una distribución CloudFront
5. Configura manejo de errores (404 → index.html)

### 2. `deploy.sh`

Despliega el proyecto build a S3.

**Uso:**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Variables de entorno:**
- `S3_BUCKET_NAME` (opcional, default: `alisonvivanco-website`)
- `AWS_REGION` (opcional, default: `us-east-1`)
- `BUILD_DIR` (opcional, default: `dist`)

**Ejemplo:**
```bash
S3_BUCKET_NAME=mi-website ./scripts/deploy.sh
```

**Qué hace:**
1. Verifica que el directorio de build existe
2. Sincroniza archivos con S3
3. Configura headers de cache apropiados
4. Configura Content-Type correcto para cada tipo de archivo

## Configuración de GitHub Actions

### Secrets Requeridos

Agrega estos secrets en tu repositorio de GitHub (Settings → Secrets and variables → Actions):

1. **AWS_ACCESS_KEY_ID**: Tu Access Key ID de AWS
2. **AWS_SECRET_ACCESS_KEY**: Tu Secret Access Key de AWS
3. **S3_BUCKET_NAME**: Nombre del bucket S3 (ej: `alisonvivanco-website`)
4. **CLOUDFRONT_DISTRIBUTION_ID**: ID de la distribución CloudFront (se obtiene después de ejecutar `setup-aws-infrastructure.sh`)
5. **ACM_CERTIFICATE_ARN** (opcional): ARN del certificado SSL en us-east-1 para el dominio `alisonvivanco.cl`

> **Nota sobre SSL**: Si no proporcionas `ACM_CERTIFICATE_ARN`, el script creará la distribución sin SSL. Puedes agregarlo después siguiendo la guía en `docs/DOMAIN-SETUP.md`.

### Workflow

El workflow `.github/workflows/deploy.yml` se ejecuta automáticamente cuando:
- Se hace push a `main` o `master`
- Se ejecuta manualmente desde GitHub Actions

### Pasos del Workflow

1. Checkout del código
2. Setup de Node.js
3. Instalación de dependencias
4. Build del proyecto
5. Configuración de credenciales AWS
6. Setup de infraestructura (si es necesario)
7. Despliegue a S3
8. Invalidación de cache de CloudFront

## Flujo de Trabajo Completo

### Primera vez (Setup inicial)

1. **Crear infraestructura:**
   ```bash
   ./scripts/setup-aws-infrastructure.sh
   ```

2. **Obtener el Distribution ID de CloudFront:**
   ```bash
   aws cloudfront list-distributions --query "DistributionList.Items[*].[Id,DomainName]" --output table
   ```

3. **Agregar secrets a GitHub:**
   - Ve a Settings → Secrets and variables → Actions
   - Agrega los secrets mencionados arriba

4. **Hacer push a main/master:**
   ```bash
   git push origin main
   ```

### Despliegues subsecuentes

Simplemente haz push a `main` o `master` y el workflow se ejecutará automáticamente.

## Troubleshooting

### Error: "Bucket already exists"
- El bucket ya existe. Esto es normal si ya ejecutaste el script antes.

### Error: "Access Denied"
- Verifica que tus credenciales AWS tengan los permisos necesarios.
- Verifica que el bucket policy permita acceso público.

### CloudFront tarda mucho en desplegarse
- Es normal. CloudFront puede tardar 15-20 minutos en desplegarse completamente.
- Puedes verificar el estado con:
  ```bash
  aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
  ```

### Los cambios no se ven después del despliegue
- CloudFront cachea los archivos. El workflow invalida el cache automáticamente.
- Si necesitas invalidar manualmente:
  ```bash
  aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
  ```

## URLs

Después del setup, tendrás acceso a:

- **S3 Website URL**: `http://BUCKET_NAME.s3-website-REGION.amazonaws.com`
- **CloudFront URL**: `https://DISTRIBUTION_ID.cloudfront.net`
- **Dominio personalizado**: `https://alisonvivanco.cl` (después de configurar DNS y SSL)

> Ver `docs/DOMAIN-SETUP.md` para instrucciones completas sobre cómo configurar el dominio personalizado.

## Costos Estimados

- **S3**: ~$0.023 por GB almacenado + $0.0004 por 1,000 requests
- **CloudFront**: ~$0.085 por GB transferido (primeros 10TB)
- **Total estimado**: < $5/mes para tráfico bajo-medio
