import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle, Star } from 'lucide-react'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import Card from '../../molecules/Card'
import Button from '../../atoms/Button'

const plans = [
  {
    id: 'seed',
    name: 'Plan Semilla',
    price: 29,
    period: 'mes',
    description: 'Comienza tu tesis con confianza y estructura',
    popular: false,
    features: [
      'Diagnóstico inicial automatizado',
      'Biblioteca de recursos (plantillas, guías)',
      'Checkpoints mensuales automatizados',
      'Comunidad de apoyo básica',
      'Dashboard de progreso',
      'Recordatorios y motivación',
    ],
  },
  {
    id: 'growth',
    name: 'Plan Crecimiento',
    price: 79,
    period: 'mes',
    description: 'Avanza con acompañamiento personalizado',
    popular: true,
    features: [
      'Todo lo de Semilla',
      '2 sesiones 1:1 con coach (30 min c/u)',
      'Revisión de estructura lógica',
      'Apoyo psicoemocional básico',
      'Feedback en tiempo real',
      'Prioridad en comunidad',
      'Acceso a webinars mensuales',
    ],
  },
  {
    id: 'flourishing',
    name: 'Plan Florecimiento',
    price: 199,
    period: 'mes',
    description: 'Completa tu tesis con excelencia académica',
    popular: false,
    features: [
      'Todo lo de Crecimiento',
      '4 sesiones 1:1 premium (60 min c/u)',
      'Revisión completa de capítulos',
      'Blindaje académico (plagio, citación)',
      'Preparación para defensa oral',
      'Acceso prioritario a coaches',
      'Revisión de metodología',
      'Análisis crítico de resultados',
    ],
  },
  {
    id: 'mastery',
    name: 'Plan Maestría',
    price: 399,
    period: 'mes',
    description: 'Experiencia premium con coach dedicado',
    popular: false,
    features: [
      'Todo lo de Florecimiento',
      'Coach dedicado asignado',
      'Sesiones ilimitadas',
      'Revisión completa del documento',
      'Simulación de jurado (2 sesiones)',
      'Certificación del método',
      'Acceso a red de alumni',
      'Soporte 24/7',
    ],
  },
]

export default function Pricing() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="precios" className="section-padding bg-white" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Heading level={2} id="pricing-heading" className="mb-4">
            Planes y Precios
          </Heading>
          <Text variant="large" className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Elige el plan que mejor se adapte a tus necesidades. Todos incluyen diagnóstico gratuito.
          </Text>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              {...(prefersReducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '-50px' },
                    transition: { delay: index * 0.1 },
                  })}
            >
              <Card
                className={`relative h-full flex flex-col ${
                  plan.popular
                    ? 'border-2 border-primary-700 shadow-xl scale-105'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-700 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="h-4 w-4" aria-hidden="true" />
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Heading level={3} className="mb-2">
                    {plan.name}
                  </Heading>
                  <Text variant="small" className="text-gray-600 mb-4">
                    {plan.description}
                  </Text>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>

                <ul className="flex-1 space-y-3 mb-6" role="list">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary-700 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <Text variant="small" className="text-gray-700">
                        {feature}
                      </Text>
                    </li>
                  ))}
                </ul>

                <Button
                  as="link"
                  to="/diagnostico"
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Comenzar Ahora
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Text variant="small" className="text-gray-600">
            💳 Todos los planes incluyen prueba gratuita. Cancela cuando quieras.
          </Text>
        </div>
      </div>
    </section>
  )
}
