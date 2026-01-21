import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { leadsService } from '../services/api'
import Header from '../components/organisms/Header'
import ProgressBar from '../components/molecules/ProgressBar'
import Alert from '../components/molecules/Alert'
import QuestionCard from '../components/molecules/QuestionCard'
import EmailCapture from '../components/organisms/EmailCapture'
import DiagnosisResults from '../components/organisms/DiagnosisResults'

const questions = [
  {
    id: 1,
    pillar: 'timeline',
    question: '¿Cuánto tiempo te queda para entregar tu tesis?',
    options: ['Menos de 3 meses', '3 a 6 meses', '6 meses a 1 año', 'Más de 1 año'],
    critical: true, // Esta pregunta es crítica para la recomendación del plan
  },
  {
    id: 2,
    pillar: 'viability',
    question: '¿Tienes acceso a las fuentes necesarias para tu investigación?',
    options: ['Sí, completo', 'Parcial', 'No'],
  },
  {
    id: 3,
    pillar: 'structure',
    question: '¿Tienes definido el problema de investigación?',
    options: ['Sí, muy claro', 'Parcialmente', 'No, aún no'],
  },
  {
    id: 4,
    pillar: 'emotional',
    question: '¿Cómo te sientes respecto a escribir tu tesis?',
    options: ['Confianza', 'Ansiedad moderada', 'Ansiedad alta / Bloqueo'],
  },
]

export default function Diagnosis() {
  const [step, setStep] = useState(0) // 0 = email capture, 1+ = questions
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [emailError, setEmailError] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [diagnosisResults, setDiagnosisResults] = useState<any>(null)
  const [searchParams] = useSearchParams()
  const prefersReducedMotion = useReducedMotion()
  const questionRef = useRef<HTMLDivElement>(null)

  // Check if email is in URL params (from email link)
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setStep(1) // Skip email capture if email in URL
    }
  }, [searchParams])

  const currentQuestion = step > 0 ? questions[step - 1] : null
  const isLastQuestion = step === questions.length

  // Scroll to top when question changes
  useEffect(() => {
    if (step > 0) {
      questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  // Focus management
  useEffect(() => {
    if (step > 0 && questionRef.current) {
      const firstButton = questionRef.current.querySelector('button')
      firstButton?.focus()
    }
  }, [step])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Remove spaces, dashes, and plus signs for validation
    const cleaned = phone.replace(/[\s\-+()]/g, '')
    // Accepts: numbers with optional + prefix, 8-15 digits
    const phoneRegex = /^\+?[0-9]{8,15}$/
    return phoneRegex.test(cleaned)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    setFirstNameError('')
    setPhoneError('')

    if (!firstName.trim()) {
      setFirstNameError('Por favor ingresa tu nombre')
      return
    }

    if (!email.trim()) {
      setEmailError('Por favor ingresa tu email')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido')
      return
    }

    if (!phone.trim()) {
      setPhoneError('Por favor ingresa tu teléfono')
      return
    }

    if (!validatePhone(phone)) {
      setPhoneError('Por favor ingresa un teléfono válido (ej: +56 9 1234 5678)')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await leadsService.create({
        email: email.trim(),
        firstName: firstName.trim(),
        phone: phone.trim(),
        source: 'diagnosis',
        metadata: {
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        },
      })

      setLeadId(response.data.leadId)
      setStep(1)
    } catch (err: any) {
      if (err.response?.status === 409 || err.response?.data?.message?.includes('ya existe')) {
        setLeadId(err.response?.data?.leadId || 'existing')
        setStep(1)
      } else {
        setEmailError(err.response?.data?.message || 'Error al crear lead. Por favor intenta de nuevo.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion) return

    setSelectedAnswer(answer)
    setError(null)

    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    setAnswers(newAnswers)

    if (!isLastQuestion) {
      setTimeout(() => {
        setStep(step + 1)
        setSelectedAnswer(null)
      }, prefersReducedMotion ? 0 : 300)
    } else {
      await submitDiagnosis({ ...newAnswers, [currentQuestion.id]: answer })
    }
  }

  const submitDiagnosis = async (finalAnswers: Record<number, string>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await leadsService.submitDiagnosis({
        email: email.trim(),
        firstName: firstName.trim(),
        phone: phone.trim(),
        answers: finalAnswers,
        diagnosisId: leadId || undefined,
      })

      setDiagnosisResults(response.data)
      setIsSubmitting(false) // ✅ Importante: desactivar loading después de recibir resultados
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar tu diagnóstico. Por favor intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
      }

  // Email capture screen
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <a href="#diagnosis-content" className="skip-link">
          Saltar al contenido del diagnóstico
        </a>

        <Header />

        <main id="diagnosis-content" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmailCapture
            email={email}
            firstName={firstName}
            phone={phone}
            emailError={emailError}
            firstNameError={firstNameError}
            phoneError={phoneError}
            isSubmitting={isSubmitting}
            onEmailChange={(email) => {
              setEmail(email)
              setEmailError('')
            }}
            onFirstNameChange={(firstName) => {
              setFirstName(firstName)
              setFirstNameError('')
            }}
            onPhoneChange={(phone) => {
              setPhone(phone)
              setPhoneError('')
            }}
            onSubmit={handleEmailSubmit}
          />
        </main>
      </div>
    )
  }

  // Questions and results screens
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <a href="#diagnosis-content" className="skip-link">
        Saltar al contenido del diagnóstico
      </a>

      <Header />

      <main id="diagnosis-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        {!diagnosisResults && (
          <div className="mb-8">
            <ProgressBar
              value={step}
              max={questions.length}
              label={`Pregunta ${step} de ${questions.length}`}
              showPercentage
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <Alert variant="error" title="Error">
              {error}
            </Alert>
          </div>
        )}

        {/* Question */}
        {!diagnosisResults && currentQuestion && (
          <motion.div key={step} ref={questionRef} {...animationProps}>
            <QuestionCard
              question={currentQuestion.question}
              options={currentQuestion.options}
              selectedAnswer={selectedAnswer || undefined}
              onAnswer={handleAnswer}
              disabled={isSubmitting}
            />
          </motion.div>
        )}

        {/* Results Screen */}
        {diagnosisResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <DiagnosisResults
              email={email}
              isSubmitting={isSubmitting}
              results={diagnosisResults}
            />
          </motion.div>
        )}
      </main>
    </div>
  )
}
