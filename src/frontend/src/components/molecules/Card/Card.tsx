import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  variant?: 'default' | 'dark'
}

export default function Card({ children, hover = true, variant, className = '', ...props }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-xl' : ''
  
  // Detectar si es fondo oscuro por className o variant
  const isDark = variant === 'dark' || 
    className.includes('bg-primary-') || 
    className.includes('bg-gray-900') || 
    className.includes('bg-secondary-')
  
  // Clases base
  const baseClasses = isDark 
    ? 'bg-primary-700 text-white' 
    : 'bg-white'
  
  // Clases para texto blanco en todos los elementos hijos cuando es dark
  const textColorClasses = isDark 
    ? 'text-white [&>*]:!text-white [&>h1]:!text-white [&>h2]:!text-white [&>h3]:!text-white [&>h4]:!text-white [&>h5]:!text-white [&>h6]:!text-white [&>p]:!text-white [&>span]:!text-white [&>li]:!text-white [&>ul]:!text-white [&>svg]:!text-white' 
    : ''
  
  return (
    <div
      className={`${baseClasses} rounded-lg shadow-md transition-shadow duration-200 p-6 ${hoverClass} ${textColorClasses} ${className}`}
      style={isDark ? { color: '#ffffff' } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
