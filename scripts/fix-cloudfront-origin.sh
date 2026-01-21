#!/bin/bash

# Script para corregir el origen de CloudFront cuando el bucket está en otra región
# Uso: ./scripts/fix-cloudfront-origin.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
S3_BUCKET_NAME="${S3_BUCKET_NAME:-alisonvivanco-web}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"

echo -e "${GREEN}🔧 Corrigiendo origen de CloudFront...${NC}"

# Detectar región del bucket
BUCKET_REGION=$(aws s3api get-bucket-location \
    --bucket "${S3_BUCKET_NAME}" \
    --query 'LocationConstraint' \
    --output text 2>/dev/null || echo "us-east-1")

if [ "$BUCKET_REGION" = "None" ] || [ -z "$BUCKET_REGION" ]; then
    BUCKET_REGION="us-east-1"
fi

echo -e "${GREEN}📍 Región del bucket: ${BUCKET_REGION}${NC}"

# Si no se proporcionó el Distribution ID, buscarlo
if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔍 Buscando distribución CloudFront...${NC}"
    CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront list-distributions \
        --query "DistributionList.Items[?Origins.Items[?contains(DomainName, '${S3_BUCKET_NAME}.s3')]].Id" \
        --output text | head -n 1)
    
    if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ] || [ "$CLOUDFRONT_DISTRIBUTION_ID" = "None" ]; then
        echo -e "${RED}❌ No se encontró ninguna distribución CloudFront para este bucket${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Distribución encontrada: ${CLOUDFRONT_DISTRIBUTION_ID}${NC}"

# Obtener configuración actual
echo -e "${YELLOW}📥 Obteniendo configuración actual...${NC}"
aws cloudfront get-distribution-config \
    --id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --output json > /tmp/cloudfront-config-current.json

# Extraer ETag (necesario para actualizar)
ETAG=$(jq -r '.ETag' /tmp/cloudfront-config-current.json)
CONFIG=$(jq -r '.DistributionConfig' /tmp/cloudfront-config-current.json)

# Actualizar el DomainName del origen
UPDATED_CONFIG=$(echo "$CONFIG" | jq \
    --arg domain "${S3_BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com" \
    '.Origins.Items[0].DomainName = $domain')

# Guardar configuración actualizada
echo "$UPDATED_CONFIG" > /tmp/cloudfront-config-updated.json

# Actualizar distribución
echo -e "${YELLOW}🔄 Actualizando distribución CloudFront...${NC}"
aws cloudfront update-distribution \
    --id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --if-match "$ETAG" \
    --distribution-config file:///tmp/cloudfront-config-updated.json \
    > /tmp/cloudfront-update-result.json

echo -e "${GREEN}✅ Distribución CloudFront actualizada${NC}"
echo -e "${YELLOW}⏳ La actualización puede tardar 15-20 minutos en propagarse${NC}"
echo -e "${YELLOW}💡 Puedes verificar el estado con:${NC}"
echo -e "   aws cloudfront get-distribution --id ${CLOUDFRONT_DISTRIBUTION_ID}"

# Limpiar
rm -f /tmp/cloudfront-config-current.json /tmp/cloudfront-config-updated.json /tmp/cloudfront-update-result.json
