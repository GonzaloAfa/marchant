# Arquitectura del Sistema - Método Marchant

## 🏗️ Visión Arquitectónica

> "Diseñamos una plataforma escalable, segura y modular que combina automatización inteligente con toque humano, optimizada para crecimiento rápido y experiencia de usuario excepcional."

---

## 🎯 Principios de Diseño

1. **Escalabilidad**: Arquitectura que crece sin reescribir
2. **Modularidad**: Componentes independientes y reutilizables
3. **Seguridad**: Protección de datos académicos sensibles
4. **Performance**: Respuesta rápida, experiencia fluida
5. **Mantenibilidad**: Código limpio, documentado, testeable

---

## 🏛️ Arquitectura General

### Opción Recomendada: Monolito Modular → Microservicios

**Fase 1 (MVP - Meses 1-6)**: Monolito modular
- Desarrollo rápido
- Menor complejidad
- Fácil de iterar

**Fase 2 (Escalamiento - Meses 7-18)**: Migración gradual a microservicios
- Separar servicios por dominio
- Escalabilidad independiente
- Equipos independientes

---

## 📐 Arquitectura Detallada

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │  │
│  │  (React)     │  │ (React Native)│  │  (React)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
                        ↓ HTTPS/REST
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY                           │
├─────────────────────────────────────────────────────────┤
│  - Authentication                                        │
│  - Rate Limiting                                         │
│  - Request Routing                                       │
│  - Load Balancing                                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                 BACKEND SERVICES                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │         CORE SERVICES (Monolito Modular)         │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  - User Service (Auth, Profiles)                 │  │
│  │  - Student Service (Dashboards, Progress)        │  │
│  │  - Coach Service (Sessions, Scheduling)           │  │
│  │  - Institution Service (B2B)                    │  │
│  │  - Content Service (Resources, Library)           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │         METHOD PILLARS SERVICES                   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  - Diagnosis Service (Pilar 1)                   │  │
│  │  - Structure Service (Pilar 2)                   │  │
│  │  - Emotional Support Service (Pilar 3)          │  │
│  │  - Analysis Service (Pilar 4)                    │  │
│  │  - Academic Shield Service (Pilar 5)              │  │
│  │  - Defense Coaching Service (Pilar 6)            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │         AI/ML SERVICES                           │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  - NLP Service (Text Analysis)                  │  │
│  │  - Prediction Service (Churn, Risk)             │  │
│  │  - Recommendation Service                       │  │
│  │  - Content Generation Service                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │         INTEGRATION SERVICES                     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  - Payment Service (Stripe)                      │  │
│  │  - Email Service (SendGrid)                      │  │
│  │  - Video Service (Zoom/Meet API)                 │  │
│  │  - Plagiarism Service (Turnitin API)             │  │
│  │  - Notification Service (Push, SMS)               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis      │  │   S3/Storage │  │
│  │  (Primary DB)│  │   (Cache)     │  │  (Files)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Elasticsearch│  │   MongoDB    │                    │
│  │  (Search)     │  │  (Analytics) │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Base de Datos

### PostgreSQL (Primary Database)

**Esquema Principal**:

```sql
-- Users & Authentication
users
  - id, email, password_hash, role, created_at, updated_at

user_profiles
  - user_id, first_name, last_name, phone, avatar_url, timezone

-- Students
students
  - id, user_id, academic_level, field_of_study, thesis_stage, 
    current_plan, subscription_status, created_at

student_progress
  - id, student_id, pillar_id, completion_percentage, 
    last_activity, milestones_completed

-- Coaches
coaches
  - id, user_id, certification_status, specialization, 
    rating, sessions_completed, is_active

-- Thesis/Research Projects
thesis_projects
  - id, student_id, title, field, methodology, stage, 
    start_date, target_completion_date, status

diagnosis_results
  - id, student_id, pillar_scores, overall_score, 
    recommendations, plan_suggestion, created_at

-- Sessions
coaching_sessions
  - id, student_id, coach_id, scheduled_at, duration, 
    status, notes, recording_url

-- Content & Resources
resources
  - id, title, type, category, content_url, access_level, 
    created_at

-- Institutions (B2B)
institutions
  - id, name, plan, max_students, active_students, 
    subscription_start, subscription_end

-- Payments & Subscriptions
subscriptions
  - id, user_id, plan_id, status, current_period_start, 
    current_period_end, cancel_at_period_end

payments
  - id, user_id, amount, currency, status, payment_method, 
    transaction_id, created_at
```

### Redis (Caching & Sessions)

**Uso**:
- Session storage
- Cache de consultas frecuentes
- Rate limiting
- Real-time features (notifications)

### S3/Storage (Files)

**Almacenamiento**:
- Documentos de tesis
- Videos de sesiones
- Recursos descargables
- Avatares y media

---

## 🔐 Seguridad

### Autenticación y Autorización

**Stack**:
- **JWT** para autenticación stateless
- **OAuth 2.0** para login social (Google, LinkedIn)
- **2FA** opcional para cuentas premium
- **RBAC** (Role-Based Access Control)

**Roles**:
- `student`: Acceso a dashboard y recursos según plan
- `coach`: Acceso a panel de coaching
- `admin`: Acceso completo
- `institution_admin`: Acceso a dashboard institucional

### Protección de Datos

**Encriptación**:
- **At Rest**: AES-256 para base de datos
- **In Transit**: TLS 1.3 para todas las comunicaciones
- **Sensitive Data**: Encriptación adicional para datos académicos

**Compliance**:
- **GDPR**: Para usuarios europeos
- **Ley de Protección de Datos**: Chile y otros países
- **Privacidad Académica**: Estándares universitarios

### Seguridad de Aplicación

- **Input Validation**: Sanitización de todos los inputs
- **SQL Injection Prevention**: ORM con parámetros preparados
- **XSS Protection**: Escapado de output
- **CSRF Protection**: Tokens en formularios
- **Rate Limiting**: Prevención de abuso
- **DDoS Protection**: Cloudflare o similar

---

## 🚀 Stack Tecnológico

### Backend

**Lenguaje**: Node.js (TypeScript) ✅ **IMPLEMENTADO**

**Framework**: Nest.js

**Justificación**:
- ✅ Ecosistema rico, performance, JavaScript full-stack
- ✅ Desarrollo más rápido para MVP
- ✅ Fácil contratación en LatAm
- ✅ Serverless-ready (Vercel/Netlify)
- ✅ Integración con OpenAI SDK (Node.js)

**Nota**: Para ML complejo futuro, se puede agregar microservicio Python como complemento

### Frontend

**Framework**: React.js (TypeScript)

**State Management**: Redux Toolkit o Zustand

**UI Library**: 
- Material-UI o Chakra UI
- Tailwind CSS para estilos

**Mobile**: React Native

### Base de Datos

- **PostgreSQL**: Base de datos principal
- **Redis**: Cache y sesiones
- **MongoDB**: Analytics y logs (opcional)
- **Elasticsearch**: Búsqueda avanzada (futuro)

### Infraestructura

**Cloud Provider**: AWS o Google Cloud Platform

**Servicios**:
- **Compute**: EC2/Compute Engine o ECS/Kubernetes
- **Database**: RDS/Cloud SQL (PostgreSQL)
- **Storage**: S3/Cloud Storage
- **CDN**: CloudFront/Cloud CDN
- **Monitoring**: CloudWatch/Stackdriver

**CI/CD**:
- **GitHub Actions** o **GitLab CI**
- **Docker** para containerización
- **Kubernetes** para orquestación (futuro)

---

## 🔄 Flujos de Datos Principales

### Flujo 1: Diagnóstico Inicial

```
Frontend (React)
    ↓ POST /api/diagnosis
API Gateway
    ↓
Diagnosis Service
    ↓
[Procesa respuestas]
    ↓
[Calcula scores (IA)]
    ↓
[Genera recomendaciones]
    ↓
PostgreSQL (guarda resultados)
    ↓
Redis (cache para dashboard)
    ↓
Email Service (envía reporte)
    ↓
Response al Frontend
```

### Flujo 2: Sesión de Coaching

```
Frontend (React)
    ↓ GET /api/sessions/upcoming
API Gateway
    ↓
Coach Service
    ↓
PostgreSQL (obtiene sesión)
    ↓
Video Service (genera link Zoom/Meet)
    ↓
Notification Service (recordatorio)
    ↓
Response al Frontend
```

### Flujo 3: Detección de Riesgo (IA)

```
Background Job (Cron)
    ↓
[Analiza estudiantes inactivos]
    ↓
Prediction Service (ML)
    ↓
[Calcula probabilidad de churn]
    ↓
Si riesgo > umbral:
    ↓
Notification Service (alerta a coach)
    ↓
Email Service (email al estudiante)
    ↓
PostgreSQL (registra alerta)
```

---

## 📊 Escalabilidad

### Estrategia de Escalamiento

**Horizontal Scaling**:
- Load balancers para distribuir tráfico
- Múltiples instancias de servicios
- Database read replicas

**Vertical Scaling**:
- Aumentar recursos de servidores cuando sea necesario
- Optimización de queries
- Caching estratégico

**Auto-scaling**:
- Basado en CPU, memoria, requests
- Escalar automáticamente según demanda
- Reducir costos en horas de bajo tráfico

### Optimizaciones

**Caching**:
- Redis para consultas frecuentes
- CDN para assets estáticos
- Cache de resultados de IA (cuando sea posible)

**Database**:
- Índices optimizados
- Query optimization
- Connection pooling
- Read replicas para consultas

**Performance**:
- Lazy loading
- Paginación
- Compresión de respuestas
- Minificación de assets

---

## 🔍 Monitoreo y Observabilidad

### Métricas Clave

**Infraestructura**:
- CPU, memoria, disco
- Latencia de requests
- Error rates
- Throughput

**Aplicación**:
- Response times por endpoint
- Error rates por servicio
- User activity
- Conversion funnels

**Negocio**:
- Registros diarios
- Conversiones
- Churn rate
- Revenue

### Herramientas

- **APM**: New Relic, Datadog, o Sentry
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Monitoring**: Prometheus + Grafana
- **Error Tracking**: Sentry
- **Analytics**: Mixpanel o Amplitude

---

## 🧪 Testing Strategy

### Tipos de Testing

**Unit Tests**:
- Funciones individuales
- Lógica de negocio
- Cobertura objetivo: >80%

**Integration Tests**:
- APIs endpoints
- Servicios integrados
- Base de datos

**E2E Tests**:
- Flujos completos de usuario
- Critical paths
- Selenium o Cypress

**Performance Tests**:
- Load testing
- Stress testing
- Optimización continua

---

## 📋 Checklist de Implementación

### Fase 1: MVP (Meses 1-3)
- [ ] Arquitectura base
- [ ] Autenticación y usuarios
- [ ] Base de datos principal
- [ ] API REST básica
- [ ] Frontend básico
- [ ] Módulo de diagnóstico
- [ ] Deploy a producción

### Fase 2: Core Features (Meses 4-6)
- [ ] Todos los módulos de pilares
- [ ] Sistema de coaches
- [ ] Pagos y suscripciones
- [ ] Notificaciones
- [ ] Dashboard completo

### Fase 3: Escalamiento (Meses 7-12)
- [ ] Optimización de performance
- [ ] Auto-scaling
- [ ] Monitoreo avanzado
- [ ] Migración a microservicios (gradual)
- [ ] Mobile app

---

**Documento vivo - Actualizado**: 2024
**Versión**: 1.0
