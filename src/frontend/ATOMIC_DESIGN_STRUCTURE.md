# Estructura Atomic Design - Método Marchant

## 🏗️ Arquitectura de Componentes

```
src/
├── components/
│   ├── atoms/              # Componentes básicos e indivisibles
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Icon/
│   │   ├── Text/
│   │   └── Heading/
│   │
│   ├── molecules/          # Combinaciones de átomos
│   │   ├── Card/
│   │   ├── ProgressBar/
│   │   ├── Alert/
│   │   ├── StatCard/
│   │   ├── PillarCard/
│   │   ├── NavItem/
│   │   └── QuestionCard/
│   │
│   ├── organisms/          # Secciones complejas
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── Stats/
│   │   ├── ProblemSolution/
│   │   ├── Pillars/
│   │   ├── CTA/
│   │   ├── EmailCapture/
│   │   └── DiagnosisResults/
│   │
│   ├── templates/          # Layouts de página
│   │   └── PageLayout/
│   │
│   └── index.ts            # Barrel export
│
├── pages/                   # Páginas finales
│   ├── Home.tsx
│   └── Diagnosis.tsx
│
└── services/                # Servicios (API, etc.)
    └── api.ts
```

---

## 📦 Componentes por Nivel

### Atoms (Componentes Básicos)

**Button** - Botón reutilizable con variantes
- Props: `variant`, `as` (button/link/a), `disabled`
- Variantes: `primary`, `secondary`, `outline`

**Input** - Campo de entrada con validación
- Props: `label`, `error`, `helperText`, `type`
- Incluye: validación, estados de error, accesibilidad

**Text** - Texto tipográfico
- Props: `variant` (body/small/large/lead), `weight`, `as`
- Responsive y accesible

**Heading** - Encabezados
- Props: `level` (1-6), `className`
- Tamaños responsive

**Icon** - Wrapper para iconos Lucide
- Props: `icon`, `size`, `className`

---

### Molecules (Combinaciones)

**Card** - Contenedor con sombra
- Props: `hover`, `children`
- Reutilizable para cualquier contenido

**ProgressBar** - Barra de progreso
- Props: `value`, `max`, `label`, `showPercentage`
- Accesible con ARIA

**Alert** - Mensaje de alerta
- Props: `variant` (success/error/warning/info), `title`, `onClose`
- Iconos y colores según variante

**StatCard** - Tarjeta de estadística
- Props: `value`, `label`, `sublabel`, `icon`
- Usado en sección de stats

**PillarCard** - Tarjeta de pilar del método
- Props: `icon`, `title`, `description`
- Usado en sección de 6 pilares

**NavItem** - Item de navegación
- Props: `to`, `href`, `children`
- Soporta Link y anchor

**QuestionCard** - Tarjeta de pregunta
- Props: `question`, `options`, `selectedAnswer`, `onAnswer`
- Usado en diagnóstico

---

### Organisms (Secciones Complejas)

**Header** - Navegación principal
- Incluye: logo, menú desktop, menú móvil
- Responsive y accesible

**Footer** - Pie de página
- Incluye: información, enlaces, contacto

**Hero** - Sección hero principal
- Incluye: headline, descripción, CTAs
- Animaciones con Framer Motion

**Stats** - Sección de estadísticas
- Incluye: 3 StatCards con animaciones

**ProblemSolution** - Problema vs Solución
- Incluye: 2 Cards comparativas

**Pillars** - Sección de 6 pilares
- Incluye: Grid de PillarCards

**CTA** - Call to action final
- Incluye: Heading, texto, botón

**EmailCapture** - Captura de email
- Incluye: Input, validación, submit

**DiagnosisResults** - Resultados del diagnóstico
- Incluye: Scores, recomendaciones, estados de carga

---

### Templates (Layouts)

**PageLayout** - Layout base de página
- Incluye: Header, Footer, Skip link
- Wrapper para contenido principal

---

## 🎯 Principios de Atomic Design

### 1. Atoms
- **No dependen de otros componentes**
- **Altamente reutilizables**
- **Sin lógica de negocio**
- Ejemplos: Button, Input, Text

### 2. Molecules
- **Combinan 2+ atoms**
- **Tienen propósito específico**
- **Pueden tener lógica simple**
- Ejemplos: Card, ProgressBar, Alert

### 3. Organisms
- **Combinan molecules y atoms**
- **Secciones completas de UI**
- **Pueden tener estado y lógica**
- Ejemplos: Header, Hero, Stats

### 4. Templates
- **Estructura de página**
- **Definen layout general**
- **No contienen datos reales**
- Ejemplo: PageLayout

### 5. Pages
- **Instancias de templates**
- **Con datos reales**
- **Punto de entrada de rutas**
- Ejemplos: Home, Diagnosis

---

## 📝 Convenciones

### Naming
- **Componentes**: PascalCase (Button, Card, Header)
- **Archivos**: PascalCase (Button.tsx, Card.tsx)
- **Carpetas**: PascalCase (Button/, Card/)
- **Exports**: index.ts en cada carpeta

### Estructura de Archivo
```
ComponentName/
├── ComponentName.tsx    # Componente principal
└── index.ts             # Export
```

### Props
- **TypeScript**: Interfaces tipadas
- **Default props**: Valores por defecto
- **Opcionales**: Marcados con `?`

### Estilos
- **Tailwind CSS**: Utility-first
- **Clases reutilizables**: En index.css
- **Responsive**: Mobile-first

---

## 🔄 Flujo de Desarrollo

### Crear Nuevo Componente

1. **Identificar nivel** (atom/molecule/organism)
2. **Crear carpeta** con nombre PascalCase
3. **Crear componente** con props tipadas
4. **Crear index.ts** para export
5. **Agregar a components/index.ts** si es necesario
6. **Usar en páginas/templates**

### Ejemplo: Crear nuevo Atom

```typescript
// components/atoms/Badge/Badge.tsx
interface BadgeProps {
  variant: 'primary' | 'secondary'
  children: ReactNode
}

export default function Badge({ variant, children }: BadgeProps) {
  return <span className={`badge-${variant}`}>{children}</span>
}

// components/atoms/Badge/index.ts
export { default } from './Badge'
```

---

## ✅ Ventajas de Atomic Design

1. **Reutilización**: Componentes reutilizables en múltiples contextos
2. **Mantenibilidad**: Fácil encontrar y actualizar componentes
3. **Escalabilidad**: Agregar nuevos componentes sin afectar existentes
4. **Testing**: Testear componentes aislados
5. **Colaboración**: Equipos trabajan en diferentes niveles
6. **Documentación**: Estructura clara y predecible

---

## 📚 Referencias

- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Component-Driven Development](https://www.componentdriven.org/)

---

**Última Actualización**: 2024
**Estructura**: Atomic Design v1.0
