import { LucideIcon } from 'lucide-react'
import { ComponentProps } from 'react'

interface IconProps extends ComponentProps<LucideIcon> {
  icon: LucideIcon
  size?: number | string
}

export default function Icon({ icon: IconComponent, size = 24, className = '', ...props }: IconProps) {
  return (
    <IconComponent
      size={size}
      className={className}
      aria-hidden="true"
      {...props}
    />
  )
}
