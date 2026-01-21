import { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to?: string
  href?: string
  children: React.ReactNode
}

export default function NavItem({ to, href, children, className = '', ...props }: NavItemProps) {
  const baseClasses =
    'text-gray-700 hover:text-primary-700 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded px-2 py-1'

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${className}`} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </a>
  )
}
