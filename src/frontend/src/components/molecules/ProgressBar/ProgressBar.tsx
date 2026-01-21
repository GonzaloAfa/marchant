import { HTMLAttributes } from 'react'

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  className = '',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={className} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${percentage}%`}
      >
        <div
          className="bg-primary-700 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
