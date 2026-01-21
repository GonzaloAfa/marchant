#!/bin/bash

# Script para crear y configurar S3 y CloudFront en AWS
# Uso: ./scripts/setup-aws-infrastructure.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de entorno (pueden ser pasadas o definidas en GitHub Secrets)
S3_BUCKET_NAME="${S3_BUCKET_NAME:-alisonvivanco-web}"
AWS_REGION="${AWS_REGION:-us-east-1}"
DOMAIN_NAME="${DOMAIN_NAME:-alisonvivanco.cl}" # Dominio personalizado
ACM_CERTIFICATE_ARN="${ACM_CERTIFICATE_ARN:-}" # ARN del certificado SSL (debe estar en us-east-1)

echo -e "${GREEN}🚀 Configurando infraestructura AWS...${NC}"

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

# 1. Verificar si el bucket existe y detectar su región
echo -e "${YELLOW}📦 Verificando bucket S3: ${S3_BUCKET_NAME}${NC}"

# Intentar verificar si el bucket existe
BUCKET_EXISTS=false
BUCKET_CHECK=$(aws s3 ls "s3://${S3_BUCKET_NAME}" 2>&1)

if echo "$BUCKET_CHECK" | grep -q 'NoSuchBucket'; then
    BUCKET_EXISTS=false
elif echo "$BUCKET_CHECK" | grep -q 'AccessDenied'; then
    # Si hay AccessDenied, el bucket probablemente existe pero no tenemos permisos de listado
    # Intentamos obtener la ubicación directamente
    echo -e "${YELLOW}⚠️  No se puede listar el bucket, pero puede existir. Verificando ubicación...${NC}"
    BUCKET_EXISTS=true
else
    # El bucket existe y podemos listarlo
    BUCKET_EXISTS=true
fi

if [ "$BUCKET_EXISTS" = false ]; then
    echo -e "${YELLOW}📦 Creando bucket S3: ${S3_BUCKET_NAME} en región ${AWS_REGION}...${NC}"
    
    # Intentar crear el bucket con manejo de errores
    if aws s3 mb "s3://${S3_BUCKET_NAME}" --region "$AWS_REGION" 2>&1; then
        echo -e "${GREEN}✅ Bucket S3 creado${NC}"
        BUCKET_REGION="$AWS_REGION"
    else
        CREATE_ERROR=$?
        if [ $CREATE_ERROR -eq 0 ]; then
            echo -e "${GREEN}✅ Bucket S3 creado${NC}"
            BUCKET_REGION="$AWS_REGION"
        elif aws s3 ls "s3://${S3_BUCKET_NAME}" 2>&1 | grep -vq 'NoSuchBucket'; then
            # El bucket existe ahora (puede haber sido creado por otra operación)
            echo -e "${GREEN}✅ Bucket S3 ya existe (creado por otra operación)${NC}"
            BUCKET_EXISTS=true
        else
            echo -e "${YELLOW}⚠️  Error al crear bucket o operación en progreso. Verificando si existe...${NC}"
            # Esperar un momento y verificar de nuevo
            sleep 5
            if aws s3 ls "s3://${S3_BUCKET_NAME}" 2>&1 | grep -vq 'NoSuchBucket'; then
                echo -e "${GREEN}✅ Bucket S3 existe${NC}"
                BUCKET_EXISTS=true
            else
                echo -e "${RED}❌ No se pudo crear el bucket. Puede haber una operación en progreso.${NC}"
                echo -e "${YELLOW}💡 Espera unos minutos y vuelve a intentar, o verifica manualmente en AWS Console${NC}"
                exit 1
            fi
        fi
    fi
fi

# Si el bucket existe (o fue creado), detectar su región
if [ "$BUCKET_EXISTS" = true ] || [ -n "$BUCKET_REGION" ]; then
    if [ -z "$BUCKET_REGION" ]; then
        echo -e "${YELLOW}📍 Detectando región del bucket...${NC}"
        BUCKET_REGION=$(aws s3api get-bucket-location \
            --bucket "${S3_BUCKET_NAME}" \
            --query 'LocationConstraint' \
            --output text 2>/dev/null || echo "$AWS_REGION")
        
        # us-east-1 retorna null en lugar del nombre de la región
        if [ "$BUCKET_REGION" = "None" ] || [ -z "$BUCKET_REGION" ]; then
            BUCKET_REGION="us-east-1"
        fi
        
        echo -e "${GREEN}📍 Región del bucket detectada: ${BUCKET_REGION}${NC}"
    fi
fi

# 2. Configurar bucket (usando Origin Access Control - más seguro)
echo -e "${YELLOW}⚙️  Configurando bucket S3...${NC}"

# Asegurar que Block Public Access esté habilitado (mejor práctica)
aws s3api put-public-access-block \
    --bucket "${S3_BUCKET_NAME}" \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    2>/dev/null || echo -e "${YELLOW}⚠️  No se pudo actualizar Block Public Access (puede que ya esté configurado)${NC}"

echo -e "${GREEN}✅ Configuración de bucket completada (usando Origin Access Control)${NC}"

# 3. Crear Origin Access Control (OAC) para CloudFront
echo -e "${YELLOW}🔐 Configurando Origin Access Control...${NC}"

OAC_NAME="OAC-${S3_BUCKET_NAME}"
EXISTING_OAC=$(aws cloudfront list-origin-access-controls \
    --query "OriginAccessControlList.Items[?Name=='${OAC_NAME}'].Id" \
    --output text 2>/dev/null || echo "")

if [ -n "$EXISTING_OAC" ] && [ "$EXISTING_OAC" != "None" ]; then
    echo -e "${GREEN}✅ Origin Access Control ya existe: ${EXISTING_OAC}${NC}"
    OAC_ID="$EXISTING_OAC"
else
    echo -e "${YELLOW}🔐 Creando Origin Access Control...${NC}"
    
    OAC_ID=$(aws cloudfront create-origin-access-control \
        --origin-access-control-config \
        "Name=${OAC_NAME},OriginAccessControlOriginType=s3,SigningBehavior=always,SigningProtocol=sigv4" \
        --query 'OriginAccessControl.Id' \
        --output text)
    
    echo -e "${GREEN}✅ Origin Access Control creado: ${OAC_ID}${NC}"
fi

# 4. La política de bucket se aplicará después de crear la distribución CloudFront
# (necesitamos el ARN específico de la distribución)

# 5. Crear distribución CloudFront
echo -e "${YELLOW}🌐 Configurando CloudFront...${NC}"

# Verificar si ya existe una distribución (buscar por cualquier región)
EXISTING_DIST=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Origins.Items[?contains(DomainName, '${S3_BUCKET_NAME}.s3')]].Id" \
    --output text | head -n 1)

if [ -n "$EXISTING_DIST" ] && [ "$EXISTING_DIST" != "None" ]; then
    echo -e "${GREEN}✅ Distribución CloudFront ya existe: ${EXISTING_DIST}${NC}"
    echo -e "${YELLOW}💡 CLOUDFRONT_DISTRIBUTION_ID=${EXISTING_DIST}${NC}"
    
    # Verificar si el dominio ya está configurado
    CURRENT_ALIASES=$(aws cloudfront get-distribution --id "$EXISTING_DIST" \
        --query 'Distribution.DistributionConfig.Aliases.Items' \
        --output text 2>/dev/null || echo "")
    
    if echo "$CURRENT_ALIASES" | grep -q "$DOMAIN_NAME"; then
        echo -e "${GREEN}✅ Dominio ${DOMAIN_NAME} ya está configurado${NC}"
    else
        echo -e "${YELLOW}⚠️  El dominio ${DOMAIN_NAME} no está configurado en la distribución existente${NC}"
        echo -e "${YELLOW}💡 Necesitas actualizar la distribución manualmente o crear una nueva${NC}"
    fi
else
    echo -e "${YELLOW}🌐 Creando nueva distribución CloudFront...${NC}"
    
    # Verificar si hay certificado SSL si se especificó dominio
    ALIASES_CONFIG=""
    SSL_CONFIG=""
    
    if [ -n "$DOMAIN_NAME" ]; then
        echo -e "${YELLOW}🔒 Configurando dominio personalizado: ${DOMAIN_NAME}${NC}"
        
        if [ -n "$ACM_CERTIFICATE_ARN" ]; then
            echo -e "${GREEN}✅ Usando certificado SSL: ${ACM_CERTIFICATE_ARN}${NC}"
            ALIASES_CONFIG="\"Aliases\": {
    \"Quantity\": 1,
    \"Items\": [\"${DOMAIN_NAME}\"]
  },"
            SSL_CONFIG="\"ViewerCertificate\": {
    \"ACMCertificateArn\": \"${ACM_CERTIFICATE_ARN}\",
    \"SSLSupportMethod\": \"sni-only\",
    \"MinimumProtocolVersion\": \"TLSv1.2_2021\"
  },"
        else
            echo -e "${YELLOW}⚠️  No se proporcionó ACM_CERTIFICATE_ARN${NC}"
            echo -e "${YELLOW}💡 Creando distribución sin SSL. Puedes agregar el certificado después.${NC}"
            echo -e "${YELLOW}📝 Para obtener un certificado SSL gratuito:${NC}"
            echo -e "   1. Ve a AWS Certificate Manager (ACM) en región us-east-1"
            echo -e "   2. Solicita un certificado para ${DOMAIN_NAME}"
            echo -e "   3. Valida el certificado (DNS o email)"
            echo -e "   4. Ejecuta este script nuevamente con ACM_CERTIFICATE_ARN"
        fi
    fi
    
    # Crear configuración de CloudFront con OAC
    cat > /tmp/cloudfront-config.json <<EOF
{
  "CallerReference": "$(date +%s)",
  "Comment": "Distribution for ${S3_BUCKET_NAME} - ${DOMAIN_NAME}",
  "DefaultRootObject": "index.html",
  ${ALIASES_CONFIG}
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-${S3_BUCKET_NAME}",
        "DomainName": "${S3_BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com",
        "OriginAccessControlId": "${OAC_ID}",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${S3_BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  ${SSL_CONFIG}
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF

    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --distribution-config file:///tmp/cloudfront-config.json \
        --query 'Distribution.Id' \
        --output text)
    
    echo -e "${GREEN}✅ Distribución CloudFront creada: ${DISTRIBUTION_ID}${NC}"
    
    # Aplicar política de bucket con el ARN específico de la distribución
    echo -e "${YELLOW}📝 Aplicando política de bucket para OAC...${NC}"
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    DIST_ARN="arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DISTRIBUTION_ID}"
    
    cat > /tmp/bucket-policy-oac-final.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${S3_BUCKET_NAME}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "${DIST_ARN}"
        }
      }
    }
  ]
}
EOF
    
    # Deshabilitar temporalmente BlockPublicPolicy para aplicar la política
    echo -e "${YELLOW}⚠️  Deshabilitando temporalmente BlockPublicPolicy para aplicar política...${NC}"
    aws s3api put-public-access-block \
        --bucket "${S3_BUCKET_NAME}" \
        --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=true" \
        2>/dev/null || echo -e "${YELLOW}⚠️  No se pudo cambiar BlockPublicPolicy (puede estar a nivel de cuenta)${NC}"
    
    # Aplicar política
    if aws s3api put-bucket-policy \
        --bucket "${S3_BUCKET_NAME}" \
        --policy file:///tmp/bucket-policy-oac-final.json 2>/dev/null; then
        echo -e "${GREEN}✅ Política de bucket aplicada exitosamente${NC}"
        
        # Volver a habilitar BlockPublicPolicy
        aws s3api put-public-access-block \
            --bucket "${S3_BUCKET_NAME}" \
            --public-access-block-configuration \
            "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
            2>/dev/null || echo -e "${YELLOW}⚠️  No se pudo re-habilitar BlockPublicPolicy${NC}"
    else
        echo -e "${RED}❌ No se pudo aplicar la política automáticamente${NC}"
        echo -e "${YELLOW}💡 Esto puede deberse a que BlockPublicPolicy está habilitado a nivel de cuenta${NC}"
        echo -e "${YELLOW}📝 Opciones:${NC}"
        echo -e "   1. Deshabilitar BlockPublicPolicy a nivel de cuenta en S3 Settings"
        echo -e "   2. O aplicar la política manualmente desde AWS Console"
        echo -e "   3. Política guardada en: /tmp/bucket-policy-oac-final.json"
        echo -e ""
        echo -e "${YELLOW}Política necesaria:${NC}"
        cat /tmp/bucket-policy-oac-final.json
    fi
    echo -e "${YELLOW}💡 CLOUDFRONT_DISTRIBUTION_ID=${DISTRIBUTION_ID}${NC}"
    
    if [ -n "$DOMAIN_NAME" ]; then
        if [ -n "$ACM_CERTIFICATE_ARN" ]; then
            echo -e "${GREEN}✅ Dominio ${DOMAIN_NAME} configurado con SSL${NC}"
            echo -e "${YELLOW}📝 Configura el DNS de ${DOMAIN_NAME} para apuntar a:${NC}"
            CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" \
                --query 'Distribution.DomainName' \
                --output text)
            echo -e "   ${CLOUDFRONT_DOMAIN}"
            echo -e "${YELLOW}   Tipo: CNAME${NC}"
        else
            echo -e "${YELLOW}⚠️  Dominio configurado pero sin SSL. Agrega el certificado después.${NC}"
        fi
    fi
    
    echo -e "${YELLOW}⏳ La distribución puede tardar 15-20 minutos en estar completamente desplegada${NC}"
fi

# Limpiar archivos temporales
rm -f /tmp/bucket-policy.json /tmp/bucket-policy-oac.json /tmp/bucket-policy-oac-final.json /tmp/cloudfront-config.json

echo -e "${GREEN}✅ Configuración de infraestructura completada${NC}"
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo -e "   1. Agrega estos secrets a GitHub:"
echo -e "      - AWS_ACCESS_KEY_ID"
echo -e "      - AWS_SECRET_ACCESS_KEY"
echo -e "      - S3_BUCKET_NAME=${S3_BUCKET_NAME}"
if [ -n "$DISTRIBUTION_ID" ]; then
    echo -e "      - CLOUDFRONT_DISTRIBUTION_ID=${DISTRIBUTION_ID}"
fi
if [ -n "$DOMAIN_NAME" ] && [ -z "$ACM_CERTIFICATE_ARN" ]; then
    echo -e ""
    echo -e "${YELLOW}🔒 Configuración SSL para ${DOMAIN_NAME}:${NC}"
    echo -e "   1. Ve a AWS Certificate Manager (ACM) en región us-east-1"
    echo -e "   2. Solicita un certificado público para:"
    echo -e "      - ${DOMAIN_NAME}"
    echo -e "      - www.${DOMAIN_NAME} (opcional)"
    echo -e "   3. Valida el certificado usando DNS o email"
    echo -e "   4. Una vez validado, ejecuta este script nuevamente con:"
    echo -e "      ACM_CERTIFICATE_ARN=arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT_ID"
fi
if [ -n "$DOMAIN_NAME" ] && [ -n "$DISTRIBUTION_ID" ]; then
    echo -e ""
    echo -e "${YELLOW}🌐 Configuración DNS para ${DOMAIN_NAME}:${NC}"
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" \
        --query 'Distribution.DomainName' \
        --output text 2>/dev/null || echo "Obtener desde AWS Console")
    echo -e "   Crea un registro CNAME en tu DNS:"
    echo -e "   Nombre: ${DOMAIN_NAME}"
    echo -e "   Valor: ${CLOUDFRONT_DOMAIN}"
fi
