import { HTMLAttributes, ReactNode } from 'react'
import Card from '../Card'

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number
  label: string
  sublabel?: string
  icon?: ReactNode
}

export default function StatCard({ value, label, sublabel, icon, className = '', ...props }: StatCardProps) {
  return (
    <Card className={`text-center ${className}`} {...props}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <div className="text-4xl md:text-5xl font-bold text-primary-700 mb-2" aria-label={String(value)}>
        {value}
      </div>
      <div className="text-lg font-semibold text-gray-900 mb-1">{label}</div>
      {sublabel && <div className="text-sm text-gray-600">{sublabel}</div>}
    </Card>
  )
}
