# Frontend - Método Marchant

## 🏗️ Estructura Atomic Design

Este proyecto sigue la metodología **Atomic Design** para máxima mantenibilidad y escalabilidad.

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Input, Text, etc.)
│   ├── molecules/      # Combinaciones (Card, ProgressBar, Alert, etc.)
│   ├── organisms/      # Secciones complejas (Header, Hero, Stats, etc.)
│   └── templates/      # Layouts (PageLayout)
├── pages/              # Páginas finales (Home, Diagnosis)
└── services/           # Servicios (API, etc.)
```

---

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 🎨 Stack Tecnológico

- **React 18** + **TypeScript**
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animaciones suaves
- **React Router** - Navegación
- **Lucide React** - Iconos

---

## 📦 Componentes Disponibles

### Atoms
- `Button` - Botón con variantes (primary, secondary, outline)
- `Input` - Campo de entrada con validación
- `Text` - Texto tipográfico responsive
- `Heading` - Encabezados (h1-h6)
- `Icon` - Wrapper para iconos

### Molecules
- `Card` - Contenedor con sombra
- `ProgressBar` - Barra de progreso accesible
- `Alert` - Mensajes de alerta (success, error, warning, info)
- `StatCard` - Tarjeta de estadística
- `PillarCard` - Tarjeta de pilar del método
- `NavItem` - Item de navegación
- `QuestionCard` - Tarjeta de pregunta (diagnóstico)

### Organisms
- `Header` - Navegación principal (responsive)
- `Footer` - Pie de página
- `Hero` - Sección hero principal
- `Stats` - Sección de estadísticas
- `ProblemSolution` - Problema vs Solución
- `Pillars` - Sección de 6 pilares
- `CTA` - Call to action final
- `EmailCapture` - Captura de email
- `DiagnosisResults` - Resultados del diagnóstico

### Templates
- `PageLayout` - Layout base (Header + Footer)

---

## 📝 Uso de Componentes

### Ejemplo: Usar Button

```tsx
import { Button } from '../components'

// Como botón
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>

// Como link
<Button as="link" to="/diagnostico" variant="primary">
  Ir a diagnóstico
</Button>

// Como anchor
<Button as="a" href="#metodo" variant="outline">
  Conoce el método
</Button>
```

### Ejemplo: Usar Organisms

```tsx
import { Hero, Stats, Pillars } from '../components'

function Home() {
  return (
    <PageLayout>
      <Hero />
      <Stats />
      <Pillars />
    </PageLayout>
  )
}
```

---

## 🎯 Principios de Desarrollo

1. **Atomic Design**: Componentes organizados por nivel de complejidad
2. **Reutilización**: Componentes reutilizables en múltiples contextos
3. **TypeScript**: Tipado fuerte para mejor DX
4. **Accesibilidad**: WCAG 2.1 AA compliant
5. **Responsive**: Mobile-first design
6. **Performance**: Optimizado para carga rápida

---

## 📚 Documentación

- **Estructura Atomic Design**: Ver `ATOMIC_DESIGN_STRUCTURE.md`
- **Accesibilidad**: Ver `ACCESSIBILITY_IMPROVEMENTS.md`
- **API Integration**: Ver `services/api.ts`

---

## 🔧 Variables de Entorno

Crear `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## ✅ Checklist de Desarrollo

- [ ] Componentes siguen Atomic Design
- [ ] TypeScript sin errores
- [ ] Accesibilidad WCAG AA
- [ ] Responsive en todos los breakpoints
- [ ] Tests (cuando se agreguen)

---

**Última Actualización**: 2024
**Estructura**: Atomic Design v1.0
