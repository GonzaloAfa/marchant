import { HTMLAttributes, ReactNode } from 'react'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel
  children: ReactNode
  className?: string
}

const sizeClasses = {
  1: 'text-4xl sm:text-5xl md:text-6xl',
  2: 'text-3xl md:text-4xl',
  3: 'text-2xl md:text-3xl',
  4: 'text-xl md:text-2xl',
  5: 'text-lg md:text-xl',
  6: 'text-base md:text-lg',
}

export default function Heading({ level, children, className = '', ...props }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  const classes = `${sizeClasses[level]} font-bold text-gray-900 ${className}`

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
