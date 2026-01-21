import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import Button from '../../atoms/Button'

export default function CtaSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="bg-primary-700 text-white section-padding" aria-labelledby="cta-heading">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
              })}
        >
          <Heading level={2} id="cta-heading" className="mb-6 text-white">
            ¿Listo para Completar tu Tesis?
          </Heading>
          <Text variant="large" className="mb-8 opacity-95 leading-relaxed">
            Descubre tu ruta personalizada en 15 minutos. Sin compromiso.
          </Text>
          <Button as="link" to="/diagnostico" variant="secondary" className="text-lg px-8 py-4">
            <span>Iniciar Diagnóstico Gratuito</span>
            <ArrowRight className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
