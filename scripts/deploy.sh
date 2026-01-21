#!/bin/bash

# Script para desplegar el proyecto build a S3
# Uso: ./scripts/deploy.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de entorno
S3_BUCKET_NAME="${S3_BUCKET_NAME:-alisonvivanco-web}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUILD_DIR="${BUILD_DIR:-dist}"

echo -e "${GREEN}🚀 Desplegando a S3...${NC}"

# Verificar que el directorio de build existe
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Directorio de build no encontrado: ${BUILD_DIR}${NC}"
    echo -e "${YELLOW}💡 Ejecuta 'yarn build' primero${NC}"
    exit 1
fi

# Verificar que AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi

# Verificar credenciales de AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ No se pudieron verificar las credenciales de AWS.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Credenciales de AWS verificadas${NC}"

# Verificar que el bucket existe
if ! aws s3 ls "s3://${S3_BUCKET_NAME}" &> /dev/null; then
    echo -e "${RED}❌ El bucket S3 no existe: ${S3_BUCKET_NAME}${NC}"
    echo -e "${YELLOW}💡 Ejecuta './scripts/setup-aws-infrastructure.sh' primero${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Sincronizando archivos con S3...${NC}"

# Sincronizar archivos (elimina archivos que ya no existen en el build)
aws s3 sync "$BUILD_DIR" "s3://${S3_BUCKET_NAME}" \
    --region "$AWS_REGION" \
    --delete \
    --exact-timestamps \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "*.json"

# Subir archivos HTML con cache más corto
aws s3 sync "$BUILD_DIR" "s3://${S3_BUCKET_NAME}" \
    --region "$AWS_REGION" \
    --exclude "*" \
    --include "*.html" \
    --include "*.json" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html; charset=utf-8"

# Configurar Content-Type para archivos específicos
aws s3 cp "$BUILD_DIR" "s3://${S3_BUCKET_NAME}" \
    --region "$AWS_REGION" \
    --recursive \
    --exclude "*" \
    --include "*.js" \
    --content-type "application/javascript" \
    --cache-control "public, max-age=31536000, immutable"

aws s3 cp "$BUILD_DIR" "s3://${S3_BUCKET_NAME}" \
    --region "$AWS_REGION" \
    --recursive \
    --exclude "*" \
    --include "*.css" \
    --content-type "text/css" \
    --cache-control "public, max-age=31536000, immutable"

aws s3 cp "$BUILD_DIR" "s3://${S3_BUCKET_NAME}" \
    --region "$AWS_REGION" \
    --recursive \
    --exclude "*" \
    --include "*.avif" \
    --include "*.jpg" \
    --include "*.jpeg" \
    --include "*.png" \
    --include "*.webp" \
    --include "*.svg" \
    --cache-control "public, max-age=31536000, immutable"

echo -e "${GREEN}✅ Despliegue completado${NC}"
echo -e "${YELLOW}🌐 URL del bucket: http://${S3_BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com${NC}"
