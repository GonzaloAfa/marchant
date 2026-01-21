import PageLayout from '../components/templates/PageLayout'
import Hero from '../components/organisms/Hero'
import Stats from '../components/organisms/Stats'
import ProblemSolution from '../components/organisms/ProblemSolution'
import Pillars from '../components/organisms/Pillars'
import Pricing from '../components/organisms/Pricing'
import { CtaSection } from '../components'

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <Stats />
      <ProblemSolution />
      <Pillars />
      <Pricing />
      <CtaSection />
    </PageLayout>
  )
}
