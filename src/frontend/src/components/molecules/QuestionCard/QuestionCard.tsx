import { HTMLAttributes } from 'react'
import Heading from '../../atoms/Heading'

interface QuestionCardProps extends HTMLAttributes<HTMLDivElement> {
  question: string
  options: string[]
  selectedAnswer?: string
  onAnswer: (answer: string) => void
  disabled?: boolean
}

export default function QuestionCard({
  question,
  options,
  selectedAnswer,
  onAnswer,
  disabled = false,
  className = '',
  ...props
}: QuestionCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent, answer: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onAnswer(answer)
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 md:p-8 ${className}`} role="region" aria-labelledby="question-heading" {...props}>
      <Heading level={2} id="question-heading" className="mb-6 leading-tight">
        {question}
      </Heading>
      <div className="space-y-3" role="radiogroup" aria-labelledby="question-heading">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option

          return (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200
                ${
                  isSelected
                    ? 'border-primary-700 bg-primary-50 text-gray-900 ring-2 ring-primary-600 ring-offset-2'
                    : 'border-gray-300 bg-white text-gray-900 hover:border-primary-500 hover:bg-primary-50'
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              disabled={disabled}
              aria-pressed={isSelected}
              role="radio"
              aria-label={option}
            >
              <span className="font-medium">{option}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
