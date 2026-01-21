import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import Card from '../../molecules/Card'

const problems = [
  'No sabes por dónde empezar',
  'Ansiedad y bloqueos constantes',
  'Falta de estructura lógica',
  'Riesgo de plagio y errores',
]

const solutions = [
  'Ruta personalizada desde el día 1',
  'Apoyo emocional y gestión de ansiedad',
  'Estructura lógica garantizada',
  'Blindaje académico completo',
]

export default function ProblemSolution() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="metodo" className="section-padding bg-gray-50" aria-labelledby="problem-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Heading level={2} id="problem-heading" className="mb-4">
            El Problema que Resolvemos
          </Heading>
          <Text variant="large" className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            50% de estudiantes abandonan su tesis antes de completarla. No es falta de capacidad, es falta de método y apoyo.
          </Text>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, x: -20 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true, margin: '-100px' },
                })}
          >
            <Card>
              <Heading level={3} className="mb-4">
                <span aria-hidden="true">❌</span> Sin Método
              </Heading>
              <ul className="space-y-3 text-gray-700" role="list">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 text-gray-400" aria-hidden="true">
                      •
                    </span>
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
          <motion.div
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, x: 20 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true, margin: '-100px' },
                })}
          >
            <Card variant="dark" className="bg-primary-700">
              <Heading level={3} className="mb-4">
                <span aria-hidden="true">✅</span> Con Método Marchant
              </Heading>
              <ul className="space-y-3" role="list">
                {solutions.map((solution, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-3 h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
