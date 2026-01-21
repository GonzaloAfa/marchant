import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

interface BaseButtonProps {
  variant?: ButtonVariant
  className?: string
  disabled?: boolean
}

interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  as?: 'button'
  to?: never
  href?: never
  children: ReactNode
}

interface ButtonAsLink extends BaseButtonProps, Omit<LinkProps, 'className' | 'children'> {
  as: 'link'
  to: string
  href?: never
  children: ReactNode
}

interface ButtonAsAnchor extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> {
  as: 'a'
  href: string
  to?: never
  children: ReactNode
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

export default function Button(props: ButtonProps) {
  const { variant = 'primary', children, className = '', disabled, ...rest } = props

  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:ring-offset-2',
    outline: 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50 hover:border-primary-800 hover:text-primary-800 active:bg-primary-100 active:border-primary-900 active:text-primary-900 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
  }

  // Estilos para asegurar que el texto y los iconos sean siempre visibles
  const textColorClasses = {
    primary: '[&>*]:!text-white [&>svg]:!text-white [&>span]:!text-white',
    secondary: '[&>*]:!text-white [&>svg]:!text-white [&>span]:!text-white',
    outline: '[&>*]:!text-primary-700 hover:[&>*]:!text-primary-800 active:[&>*]:!text-primary-900 [&>svg]:!text-primary-700 hover:[&>svg]:!text-primary-800 active:[&>svg]:!text-primary-900',
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${textColorClasses[variant]} ${className}`

  if (props.as === 'link') {
    const { as, variant: _, disabled: __, className: ___, ...linkProps } = props
    return (
      <Link {...linkProps} className={classes} aria-disabled={disabled} style={{ color: variant === 'outline' ? undefined : '#ffffff' }}>
        {children}
      </Link>
    )
  }

  if (props.as === 'a') {
    const { as, variant: _, disabled: __, className: ___, ...anchorProps } = props
    return (
      <a {...anchorProps} className={classes} aria-disabled={disabled} style={{ color: variant === 'outline' ? undefined : '#ffffff' }}>
        {children}
      </a>
    )
  }

  const { as, to, href, variant: _, disabled: __, className: ___, ...buttonProps } = props as ButtonAsButton
  return (
    <button {...buttonProps} className={classes} disabled={disabled} style={{ color: variant === 'outline' ? undefined : '#ffffff' }}>
      {children}
    </button>
  )
}
