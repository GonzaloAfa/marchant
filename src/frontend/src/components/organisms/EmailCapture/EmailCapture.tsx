import { FormEvent, useRef, useEffect } from 'react'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import Card from '../../molecules/Card'

interface EmailCaptureProps {
  email: string
  firstName: string
  phone: string
  emailError: string
  firstNameError: string
  phoneError: string
  isSubmitting: boolean
  onEmailChange: (email: string) => void
  onFirstNameChange: (firstName: string) => void
  onPhoneChange: (phone: string) => void
  onSubmit: (e: FormEvent) => void
}

export default function EmailCapture({
  email,
  firstName,
  phone,
  emailError,
  firstNameError,
  phoneError,
  isSubmitting,
  onEmailChange,
  onFirstNameChange,
  onPhoneChange,
  onSubmit,
}: EmailCaptureProps) {
  const firstNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstNameRef.current?.focus()
  }, [])

  return (
    <Card className="p-8 md:p-12 text-center">
      <Mail className="h-16 w-16 text-primary-700 mx-auto mb-6" aria-hidden="true" />
      <Heading level={1} className="mb-4">
        Comienza tu Diagnóstico Gratuito
      </Heading>
      <Text variant="large" className="text-gray-700 mb-8 leading-relaxed">
        Para recibir tus resultados personalizados, necesitamos algunos datos.
      </Text>

      <form onSubmit={onSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <Input
            ref={firstNameRef}
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="Tu nombre"
            label="Nombre"
            error={firstNameError}
            required
            className="text-lg"
          />
        </div>

        <div className="mb-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="tu@email.com"
            label="Email"
            error={emailError}
            required
            className="text-lg"
          />
        </div>

        <div className="mb-6">
          <Input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+56 9 1234 5678"
            label="Teléfono (WhatsApp)"
            error={phoneError}
            required
            className="text-lg"
            aria-describedby="phone-help"
          />
          <Text variant="small" id="phone-help" className="text-gray-500 mt-1">
            📱 Te contactaremos por WhatsApp con tus resultados
          </Text>
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting} className="text-lg px-8 py-4 w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>Continuar</span>
              <ArrowRight className="h-5 w-5 rotate-180" aria-hidden="true" />
            </>
          )}
        </Button>

        <Text variant="small" className="text-gray-500 mt-4">
          🔒 Tu información está segura. No compartimos tus datos con terceros.
        </Text>
      </form>
    </Card>
  )
}
