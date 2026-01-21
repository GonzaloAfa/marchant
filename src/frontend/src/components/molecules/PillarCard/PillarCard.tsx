import { LucideIcon } from 'lucide-react'
import Card from '../Card'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'

interface PillarCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function PillarCard({ icon: Icon, title, description }: PillarCardProps) {
  return (
    <Card>
      <Icon className="h-12 w-12 text-primary-700 mb-4" aria-hidden="true" />
      <Heading level={3} className="mb-2">
        {title}
      </Heading>
      <Text className="leading-relaxed">{description}</Text>
    </Card>
  )
}
