import { ReactNode } from 'react'
import Header from '../../organisms/Header'
import Footer from '../../organisms/Footer'

interface PageLayoutProps {
  children: ReactNode
  skipLink?: boolean
}

export default function PageLayout({ children, skipLink = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {skipLink && (
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
      )}
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}
