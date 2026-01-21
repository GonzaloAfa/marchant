import { HTMLAttributes, ReactNode } from 'react'

type TextVariant = 'body' | 'small' | 'large' | 'lead'
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant
  weight?: TextWeight
  as?: 'p' | 'span' | 'div'
  children: ReactNode
  className?: string
}

const variantClasses = {
  body: 'text-base',
  small: 'text-sm',
  large: 'text-lg',
  lead: 'text-xl md:text-2xl',
}

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export default function Text({
  variant = 'body',
  weight = 'normal',
  as: Component = 'p',
  children,
  className = '',
  ...props
}: TextProps) {
  const classes = `${variantClasses[variant]} ${weightClasses[weight]} ${className}`

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
