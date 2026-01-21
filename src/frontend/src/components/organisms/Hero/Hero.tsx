import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import Button from '../../atoms/Button'

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const animationProps = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } }

  return (
    <section className="section-padding" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div {...animationProps} className="text-center">
          <Heading level={1} id="hero-heading" className="mb-6 leading-tight">
            Completa tu Tesis con
            <span className="text-primary-700"> Confianza</span>
          </Heading>
          <Text variant="lead" className="text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            El único método certificado que combina <strong className="font-semibold text-gray-900">rigor académico</strong>,{' '}
            <strong className="font-semibold text-gray-900">apoyo emocional</strong> y{' '}
            <strong className="font-semibold text-gray-900">tecnología de vanguardia</strong> para transformar tu experiencia
            de investigación.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button as="link" to="/diagnostico" variant="primary" className="text-lg px-8 py-4 w-full sm:w-auto">
              <span>Inicia tu Diagnóstico Gratuito</span>
              <ArrowRight className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            </Button>
            <Button as="a" href="#metodo" variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto">
              Conoce el Método
            </Button>
          </div>
          <Text variant="small" className="text-gray-600 mt-6" role="note">
            <span aria-hidden="true">⚡</span> 15 minutos • Sin tarjeta de crédito • Resultados inmediatos
          </Text>
        </motion.div>
      </div>
    </section>
  )
}
