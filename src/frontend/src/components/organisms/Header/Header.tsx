import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'
import NavItem from '../../molecules/NavItem'
import Button from '../../atoms/Button'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setMobileMenuOpen(false)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40" role="banner">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Navegación principal">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded"
            aria-label="Método Marchant - Ir al inicio"
          >
            <BookOpen className="h-8 w-8 text-primary-700" aria-hidden="true" />
            <span className="text-2xl font-bold text-gray-900">Método Marchant</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavItem href="#metodo">El Método</NavItem>
            <NavItem href="#pilares">6 Pilares</NavItem>
            <NavItem href="#precios">Precios</NavItem>
            <Button as="link" to="/diagnostico" variant="primary">
              Diagnóstico Gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 pb-4 space-y-2" role="menu">
            <NavItem href="#metodo" className="block" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
              El Método
            </NavItem>
            <NavItem href="#pilares" className="block" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
              6 Pilares
            </NavItem>
            <NavItem href="#precios" className="block" role="menuitem" onClick={() => setMobileMenuOpen(false)}>
              Precios
            </NavItem>
            <Button
              as="link"
              to="/diagnostico"
              variant="primary"
              className="block w-full"
              role="menuitem"
              onClick={() => setMobileMenuOpen(false)}
            >
              Diagnóstico Gratis
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}
