#!/bin/bash

# Script para verificar el estado de CloudFront y obtener información para DNS
# Uso: ./scripts/check-cloudfront-status.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
S3_BUCKET_NAME="${S3_BUCKET_NAME:-alisonvivanco-web}"
DOMAIN_NAME="${DOMAIN_NAME:-alisonvivanco.cl}"

echo -e "${GREEN}🔍 Verificando distribuciones CloudFront...${NC}"

# Buscar distribuciones relacionadas con el bucket
DISTRIBUTIONS=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Origins.Items[?contains(DomainName, '${S3_BUCKET_NAME}.s3')]].[Id,DomainName,Status,Aliases.Items[0]]" \
    --output table)

if [ -z "$DISTRIBUTIONS" ] || echo "$DISTRIBUTIONS" | grep -q "None"; then
    echo -e "${RED}❌ No se encontraron distribuciones CloudFront${NC}"
    exit 1
fi

echo -e "${GREEN}📋 Distribuciones encontradas:${NC}"
echo "$DISTRIBUTIONS"

# Obtener detalles de la primera distribución
DIST_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Origins.Items[?contains(DomainName, '${S3_BUCKET_NAME}.s3')]].Id" \
    --output text | head -n 1)

if [ -z "$DIST_ID" ] || [ "$DIST_ID" = "None" ]; then
    echo -e "${RED}❌ No se encontró distribución${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📊 Detalles de la distribución: ${DIST_ID}${NC}"

# Obtener información completa
DIST_INFO=$(aws cloudfront get-distribution --id "$DIST_ID")

DOMAIN_NAME_CF=$(echo "$DIST_INFO" | jq -r '.Distribution.DomainName')
STATUS=$(echo "$DIST_INFO" | jq -r '.Distribution.Status')
ALIASES=$(echo "$DIST_INFO" | jq -r '.Distribution.DistributionConfig.Aliases.Items[]?' 2>/dev/null || echo "Ninguno")

echo -e "${GREEN}🌐 Domain Name de CloudFront:${NC} ${DOMAIN_NAME_CF}"
echo -e "${GREEN}📊 Estado:${NC} ${STATUS}"
echo -e "${GREEN}🏷️  Aliases configurados:${NC}"

if [ "$ALIASES" = "Ninguno" ] || [ -z "$ALIASES" ]; then
    echo -e "${RED}   ❌ No hay aliases configurados${NC}"
    echo -e "${YELLOW}💡 Para que Route 53 pueda detectar la distribución, necesitas:${NC}"
    echo -e "   1. Agregar el alias '${DOMAIN_NAME}' a la distribución CloudFront"
    echo -e "   2. Tener un certificado SSL en ACM (us-east-1) para ${DOMAIN_NAME}"
else
    echo "$ALIASES" | while read -r alias; do
        if [ "$alias" = "$DOMAIN_NAME" ]; then
            echo -e "${GREEN}   ✅ ${alias} (configurado)${NC}"
        else
            echo -e "${YELLOW}   - ${alias}${NC}"
        fi
    done
fi

echo -e "\n${YELLOW}📝 Para crear el registro DNS en Route 53:${NC}"

if echo "$ALIASES" | grep -q "$DOMAIN_NAME"; then
    echo -e "${GREEN}✅ El alias está configurado. Puedes usar:${NC}"
    echo -e "   Tipo: A - Alias"
    echo -e "   Nombre: (dejar en blanco para dominio raíz o 'www' para subdominio)"
    echo -e "   Alias: Sí"
    echo -e "   Distribución CloudFront: ${DIST_ID}"
    echo -e "   O manualmente: ${DOMAIN_NAME_CF}"
else
    echo -e "${YELLOW}⚠️  El alias no está configurado. Opciones:${NC}"
    echo -e ""
    echo -e "${YELLOW}Opción 1: Crear registro CNAME manualmente${NC}"
    echo -e "   Tipo: CNAME"
    echo -e "   Nombre: (dejar en blanco para dominio raíz)"
    echo -e "   Valor: ${DOMAIN_NAME_CF}"
    echo -e ""
    echo -e "${YELLOW}Opción 2: Configurar alias en CloudFront primero${NC}"
    echo -e "   1. Ve a CloudFront → Distribución ${DIST_ID}"
    echo -e "   2. Edita → General settings"
    echo -e "   3. Agrega '${DOMAIN_NAME}' en Alternate domain names (CNAMEs)"
    echo -e "   4. Selecciona tu certificado SSL en Custom SSL certificate"
    echo -e "   5. Guarda y espera a que se despliegue (15-20 min)"
    echo -e "   6. Luego podrás usar el alias en Route 53"
fi

echo -e "\n${YELLOW}🔗 CloudFront Domain:${NC} ${DOMAIN_NAME_CF}"
echo -e "${YELLOW}🆔 Distribution ID:${NC} ${DIST_ID}"
