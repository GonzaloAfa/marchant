import { CheckCircle, Loader2 } from 'lucide-react'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import Button from '../../atoms/Button'
import Card from '../../molecules/Card'

interface DiagnosisResultsProps {
  email: string
  isSubmitting: boolean
  results?: {
    scores?: {
      overall?: number
      [key: string]: number | undefined
    }
    recommendations?: {
      recommendedPlan?: string
      reason?: string
    }
  }
}

const planNames: Record<string, string> = {
  seed: 'Plan Semilla',
  growth: 'Plan Crecimiento',
  flourishing: 'Plan Florecimiento',
  mastery: 'Plan Maestría',
}

export default function DiagnosisResults({ email, isSubmitting, results }: DiagnosisResultsProps) {
  if (isSubmitting) {
    return (
      <Card className="p-8 md:p-12 text-center">
        <Loader2 className="h-16 w-16 text-primary-700 mx-auto mb-4 animate-spin" aria-hidden="true" />
        <Heading level={2} className="mb-4">
          Procesando tus respuestas...
        </Heading>
        <Text className="text-gray-600">Estamos analizando tu perfil y preparando tu ruta personalizada.</Text>
      </Card>
    )
  }

  const overallScore = results?.scores?.overall || 0
  const recommendedPlan = results?.recommendations?.recommendedPlan || 'seed'
  const reason = results?.recommendations?.reason || ''

  return (
    <Card className="p-8 md:p-12 text-center">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" aria-hidden="true" />
      <Heading level={2} className="mb-4">
        ¡Diagnóstico Completado!
      </Heading>
      <Text variant="large" className="text-gray-700 mb-6 leading-relaxed">
        Hemos enviado tus resultados personalizados a <strong>{email}</strong>
      </Text>
      <div className="bg-primary-50 rounded-lg p-6 mb-6 text-left">
        <Heading level={3} className="text-primary-700 mb-2">
          Tu Score General
        </Heading>
        <div className="text-4xl font-bold text-primary-700 mb-4" aria-label={`${overallScore} de 100`}>
          {overallScore}/100
        </div>
        <Heading level={3} className="text-gray-900 mb-2 text-lg font-semibold">
          Plan Recomendado
        </Heading>
        <Text className="text-primary-700 font-semibold text-lg">{planNames[recommendedPlan] || recommendedPlan}</Text>
        <Text className="text-gray-600 mt-2">{reason}</Text>
      </div>
      <Text variant="small" className="text-gray-600 mb-6">
        Revisa tu email para ver el reporte completo con recomendaciones detalladas.
      </Text>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button as="link" to="/" variant="outline" className="px-6 py-3">
          Volver al inicio
        </Button>
      </div>
    </Card>
  )
}
