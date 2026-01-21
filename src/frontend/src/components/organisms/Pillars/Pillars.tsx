import { motion, useReducedMotion } from 'framer-motion'
import { Shield, Brain, Users, BookOpen } from 'lucide-react'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import PillarCard from '../../molecules/PillarCard'

const pillars = [
  {
    icon: Shield,
    title: 'Diagnóstico y Viabilidad',
    description: 'Evaluación de sostenibilidad académica, acceso a fuentes y delimitación del objeto de estudio.',
  },
  {
    icon: Brain,
    title: 'Estructuración Lógica',
    description: 'Construcción de la matriz de congruencia entre problema, objetivos y metodología.',
  },
  {
    icon: Users,
    title: 'Apoyo Psicoemocional',
    description: 'Gestión de ansiedad, síndrome del impostor y bloqueos cognitivos durante el proceso.',
  },
  {
    icon: BookOpen,
    title: 'Resultados y Análisis',
    description: 'Acompañamiento técnico con enfoque crítico, políticas públicas y perspectiva de género.',
  },
  {
    icon: Shield,
    title: 'Blindaje Académico',
    description: 'Control de plagio, normas de citación y coherencia epistemológica.',
  },
  {
    icon: Users,
    title: 'Coaching Defensa Oral',
    description: 'Entrenamiento en comunicación, narrativa académica, síntesis y manejo del jurado.',
  },
]

export default function Pillars() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="pilares" className="section-padding" aria-labelledby="pilares-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Heading level={2} id="pilares-heading" className="mb-4">
            Los 6 Pilares del Método
          </Heading>
          <Text variant="large" className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Un sistema completo que cubre cada aspecto de tu proceso de investigación
          </Text>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {pillars.map((pilar, index) => (
            <motion.div
              key={index}
              {...(prefersReducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '-50px' },
                    transition: { delay: index * 0.1 },
                  })}
              role="listitem"
            >
              <PillarCard {...pilar} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
