# Especificación de API - Método Marchant

## 🔌 Arquitectura de API

**Base URL**: `https://api.marchant.com/v1`

**Autenticación**: JWT Bearer Token

**Formato**: JSON

---

## 🔐 Autenticación

### POST /auth/register
Registrar nuevo usuario

**Request**:
```json
{
  "email": "estudiante@example.com",
  "password": "securePassword123",
  "first_name": "Juan",
  "last_name": "Pérez",
  "role": "student"
}
```

**Response** (201):
```json
{
  "user": {
    "id": "usr_123",
    "email": "estudiante@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST /auth/login
Iniciar sesión

**Request**:
```json
{
  "email": "estudiante@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "user": {
    "id": "usr_123",
    "email": "estudiante@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 Usuarios y Perfiles

### GET /users/me
Obtener perfil del usuario actual

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "id": "usr_123",
  "email": "estudiante@example.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "role": "student",
  "profile": {
    "phone": "+56912345678",
    "avatar_url": "https://...",
    "timezone": "America/Santiago"
  },
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### PUT /users/me
Actualizar perfil

**Request**:
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "+56912345678"
}
```

---

## 🎓 Estudiantes

### GET /students/me
Obtener información del estudiante

**Response** (200):
```json
{
  "id": "stu_123",
  "user_id": "usr_123",
  "academic_level": "undergraduate",
  "field_of_study": "Psychology",
  "thesis_stage": "structure",
  "current_plan": "growth",
  "subscription_status": "active",
  "progress": {
    "overall": 45,
    "pillars": {
      "diagnosis": 100,
      "structure": 60,
      "emotional": 40,
      "analysis": 0,
      "shield": 0,
      "defense": 0
    }
  }
}
```

---

### GET /students/me/progress
Obtener progreso detallado

**Response** (200):
```json
{
  "overall_percentage": 45,
  "pillars": [
    {
      "id": 1,
      "name": "Diagnóstico",
      "completion": 100,
      "milestones_completed": 5,
      "total_milestones": 5
    },
    {
      "id": 2,
      "name": "Estructuración",
      "completion": 60,
      "milestones_completed": 3,
      "total_milestones": 5
    }
  ],
  "timeline": {
    "started": "2024-01-15",
    "estimated_completion": "2024-08-15",
    "on_track": true
  }
}
```

---

## 🔍 Diagnóstico (Pilar 1)

### POST /diagnosis/start
Iniciar diagnóstico

**Response** (201):
```json
{
  "diagnosis_id": "diag_123",
  "questions": [
    {
      "id": 1,
      "pillar": "viability",
      "question": "¿Tienes acceso a las fuentes necesarias?",
      "type": "multiple_choice",
      "options": ["Sí, completo", "Parcial", "No"]
    }
  ]
}
```

---

### POST /diagnosis/{diagnosis_id}/answer
Responder pregunta

**Request**:
```json
{
  "question_id": 1,
  "answer": "Parcial"
}
```

---

### POST /diagnosis/{diagnosis_id}/complete
Completar diagnóstico

**Response** (200):
```json
{
  "diagnosis_id": "diag_123",
  "scores": {
    "viability": 75,
    "structure": 60,
    "emotional": 50,
    "overall": 62
  },
  "recommendations": {
    "plan": "growth",
    "reason": "Necesitas apoyo en estructuración y manejo emocional",
    "estimated_months": 7
  },
  "risks": [
    {
      "type": "emotional",
      "severity": "medium",
      "description": "Nivel de ansiedad medio-alto detectado"
    }
  ]
}
```

---

## 📐 Estructuración Lógica (Pilar 2)

### GET /structure/matrix
Obtener matriz de congruencia actual

**Response** (200):
```json
{
  "problem": {
    "text": "Falta de acceso a salud mental en zonas rurales",
    "coherence_score": 85
  },
  "objectives": [
    {
      "id": 1,
      "text": "Identificar barreras de acceso",
      "coherence_with_problem": 90
    }
  ],
  "methodology": {
    "type": "qualitative",
    "approach": "phenomenological",
    "coherence_with_objectives": 80
  },
  "overall_coherence": 85,
  "suggestions": [
    "El objetivo 2 podría estar más alineado con el problema"
  ]
}
```

---

### POST /structure/matrix
Actualizar matriz de congruencia

**Request**:
```json
{
  "problem": "Nuevo problema de investigación",
  "objectives": ["Objetivo 1", "Objetivo 2"],
  "methodology": {
    "type": "mixed",
    "approach": "sequential"
  }
}
```

**Response** (200):
```json
{
  "coherence_score": 88,
  "analysis": {
    "strengths": ["Objetivos claros"],
    "improvements": ["Metodología podría ser más específica"]
  }
}
```

---

## 💚 Apoyo Psicoemocional (Pilar 3)

### POST /emotional/checkin
Realizar check-in emocional

**Request**:
```json
{
  "mood": "anxious",
  "energy_level": 3,
  "blockers": ["perfectionism", "time_management"],
  "notes": "Me siento abrumado con la cantidad de trabajo"
}
```

**Response** (200):
```json
{
  "checkin_id": "chk_123",
  "risk_level": "medium",
  "recommendations": [
    {
      "type": "resource",
      "title": "Guía: Manejo de Perfeccionismo",
      "url": "/resources/123"
    },
    {
      "type": "coaching",
      "message": "Tu coach te contactará en las próximas 24h"
    }
  ]
}
```

---

### GET /emotional/resources
Obtener recursos psicoemocionales

**Query Params**: `category`, `mood`

**Response** (200):
```json
{
  "resources": [
    {
      "id": "res_123",
      "title": "Cómo Manejar la Ansiedad Académica",
      "type": "article",
      "category": "anxiety",
      "duration": "10 min"
    }
  ]
}
```

---

## 📊 Análisis de Resultados (Pilar 4)

### POST /analysis/upload
Subir datos para análisis

**Request** (multipart/form-data):
- `file`: Archivo con datos
- `analysis_type`: "critical", "policy", "gender"
- `context`: Descripción del análisis

**Response** (201):
```json
{
  "analysis_id": "ana_123",
  "status": "processing",
  "estimated_time": "5 minutes"
}
```

---

### GET /analysis/{analysis_id}
Obtener resultados del análisis

**Response** (200):
```json
{
  "analysis_id": "ana_123",
  "status": "completed",
  "results": {
    "patterns_identified": 5,
    "key_findings": ["Patrón 1", "Patrón 2"],
    "suggestions": ["Considerar perspectiva de género"]
  },
  "coach_review": {
    "reviewed": true,
    "feedback": "Excelente análisis, considera profundizar en..."
  }
}
```

---

## 🛡️ Blindaje Académico (Pilar 5)

### POST /shield/check
Verificar documento

**Request** (multipart/form-data):
- `file`: Documento a verificar
- `citation_style`: "APA", "MLA", "Chicago"

**Response** (201):
```json
{
  "check_id": "chk_123",
  "status": "processing"
}
```

---

### GET /shield/{check_id}
Obtener resultados de verificación

**Response** (200):
```json
{
  "check_id": "chk_123",
  "plagiarism": {
    "score": 2,
    "status": "low",
    "matches": []
  },
  "citations": {
    "style": "APA",
    "errors": 3,
    "suggestions": [
      {
        "line": 45,
        "issue": "Falta año en cita",
        "suggestion": "Agregar (2020) después del autor"
      }
    ]
  },
  "epistemological_coherence": {
    "score": 85,
    "issues": []
  },
  "overall_score": 90,
  "report_url": "https://..."
}
```

---

## 🎤 Coaching Defensa Oral (Pilar 6)

### GET /defense/practice-questions
Obtener preguntas de práctica

**Query Params**: `thesis_id`

**Response** (200):
```json
{
  "questions": [
    {
      "id": 1,
      "type": "methodology",
      "question": "¿Por qué elegiste esta metodología?",
      "difficulty": "medium"
    }
  ]
}
```

---

### POST /defense/simulation
Iniciar simulación de defensa

**Request**:
```json
{
  "thesis_id": "thesis_123",
  "duration_minutes": 30
}
```

**Response** (201):
```json
{
  "simulation_id": "sim_123",
  "session_url": "https://zoom.us/j/...",
  "scheduled_at": "2024-02-15T14:00:00Z"
}
```

---

## 👨‍🏫 Coaching y Sesiones

### GET /coaching/sessions
Listar sesiones

**Query Params**: `status`, `upcoming`

**Response** (200):
```json
{
  "sessions": [
    {
      "id": "ses_123",
      "coach": {
        "id": "coach_123",
        "name": "Dr. María González",
        "specialization": "Social Sciences"
      },
      "scheduled_at": "2024-02-15T14:00:00Z",
      "duration": 60,
      "status": "scheduled",
      "type": "structure_review"
    }
  ]
}
```

---

### POST /coaching/sessions
Agendar nueva sesión

**Request**:
```json
{
  "coach_id": "coach_123",
  "scheduled_at": "2024-02-15T14:00:00Z",
  "duration": 60,
  "type": "structure_review",
  "notes": "Necesito revisar mi matriz de congruencia"
}
```

---

### GET /coaching/sessions/{session_id}
Obtener detalles de sesión

**Response** (200):
```json
{
  "id": "ses_123",
  "coach": {...},
  "scheduled_at": "2024-02-15T14:00:00Z",
  "duration": 60,
  "status": "completed",
  "video_url": "https://...",
  "notes": "Sesión productiva, avanzamos en estructura",
  "action_items": [
    "Revisar objetivo 2",
    "Completar lectura sugerida"
  ]
}
```

---

## 💳 Suscripciones y Pagos

### GET /subscriptions/me
Obtener suscripción actual

**Response** (200):
```json
{
  "id": "sub_123",
  "plan": "growth",
  "status": "active",
  "current_period_start": "2024-01-15",
  "current_period_end": "2024-02-15",
  "features": {
    "coaching_sessions": 2,
    "sessions_remaining": 1,
    "premium_resources": true
  }
}
```

---

### POST /subscriptions/upgrade
Upgrade de plan

**Request**:
```json
{
  "new_plan": "flourishing"
}
```

**Response** (200):
```json
{
  "subscription_id": "sub_123",
  "new_plan": "flourishing",
  "prorated_amount": 120.00,
  "next_billing_date": "2024-02-15"
}
```

---

### GET /payments/history
Historial de pagos

**Response** (200):
```json
{
  "payments": [
    {
      "id": "pay_123",
      "amount": 79.00,
      "currency": "USD",
      "status": "completed",
      "date": "2024-01-15",
      "description": "Plan Growth - Enero 2024"
    }
  ]
}
```

---

## 📚 Recursos y Contenido

### GET /resources
Listar recursos

**Query Params**: `category`, `pillar`, `access_level`

**Response** (200):
```json
{
  "resources": [
    {
      "id": "res_123",
      "title": "Guía: Estructuración de Objetivos",
      "type": "pdf",
      "category": "structure",
      "access_level": "growth",
      "download_url": "https://...",
      "size": "2.5 MB"
    }
  ]
}
```

---

## 🏛️ Instituciones (B2B)

### GET /institutions/{institution_id}/dashboard
Dashboard institucional

**Headers**: `Authorization: Bearer {institution_token}`

**Response** (200):
```json
{
  "institution": {
    "id": "inst_123",
    "name": "Universidad de Chile",
    "plan": "campus"
  },
  "metrics": {
    "total_students": 450,
    "active_students": 320,
    "completion_rate": 78,
    "average_progress": 65
  },
  "students": [
    {
      "id": "stu_123",
      "name": "Juan Pérez",
      "progress": 70,
      "risk_level": "low"
    }
  ]
}
```

---

## 🔔 Notificaciones

### GET /notifications
Listar notificaciones

**Response** (200):
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "coaching_reminder",
      "title": "Tu sesión es mañana",
      "message": "Recuerda tu sesión con Dr. González a las 14:00",
      "read": false,
      "created_at": "2024-02-14T10:00:00Z"
    }
  ]
}
```

---

### PUT /notifications/{notification_id}/read
Marcar como leída

---

## 🔍 Búsqueda

### GET /search
Búsqueda global

**Query Params**: `q`, `type` (resources, coaches, content)

**Response** (200):
```json
{
  "results": {
    "resources": [...],
    "coaches": [...],
    "content": [...]
  }
}
```

---

## 📊 Analytics (Admin)

### GET /admin/analytics/overview
Métricas generales

**Headers**: `Authorization: Bearer {admin_token}`

**Response** (200):
```json
{
  "users": {
    "total": 1200,
    "active": 800,
    "new_this_month": 150
  },
  "revenue": {
    "mrr": 48000,
    "arr": 576000,
    "growth_rate": 15
  },
  "engagement": {
    "daily_active": 450,
    "weekly_active": 650,
    "monthly_active": 800
  }
}
```

---

## 🚨 Manejo de Errores

### Códigos de Estado

- `200`: Éxito
- `201`: Creado
- `400`: Bad Request (validación)
- `401`: No autenticado
- `403`: No autorizado
- `404`: No encontrado
- `429`: Rate limit excedido
- `500`: Error del servidor

### Formato de Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El email es requerido",
    "details": {
      "field": "email",
      "issue": "required"
    }
  }
}
```

---

## 🔒 Rate Limiting

- **Autenticado**: 1000 requests/hora
- **No autenticado**: 100 requests/hora
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

**Documento vivo - Actualizado**: 2024
**Versión**: 1.0
