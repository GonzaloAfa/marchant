import { HTMLAttributes, ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  children: ReactNode
  onClose?: () => void
  title?: string
}

const variantStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
    iconColor: 'text-blue-600',
  },
}

export default function Alert({
  variant = 'info',
  children,
  onClose,
  title,
  className = '',
  ...props
}: AlertProps) {
  const styles = variantStyles[variant]
  const Icon = styles.icon

  return (
    <div
      className={`p-4 border-2 rounded-lg ${styles.container} ${className}`}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${styles.iconColor}`} aria-hidden="true" />
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 flex-shrink-0 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
            aria-label="Cerrar alerta"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
