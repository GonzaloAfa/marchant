import { motion, useReducedMotion } from 'framer-motion'
import StatCard from '../../molecules/StatCard'
import Heading from '../../atoms/Heading'

const stats = [
  { value: '75%+', label: 'Tasa de completitud', sublabel: 'vs 40-50% del mercado' },
  { value: '-30%', label: 'Tiempo de completitud', sublabel: 'vs método tradicional' },
  { value: '4.8/5', label: 'Satisfacción', sublabel: 'Estudiantes graduados' },
]

export default function Stats() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="bg-white section-padding" aria-labelledby="stats-heading">
      <div className="max-w-7xl mx-auto">
        <Heading level={2} id="stats-heading" className="sr-only">
          Estadísticas del Método Marchant
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              {...(prefersReducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.2 + index * 0.1 },
                  })}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
