import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import NavItem from '../../molecules/NavItem'
import Heading from '../../atoms/Heading'
import Text from '../../atoms/Text'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary-400" aria-hidden="true" />
              <span className="text-xl font-bold text-white">Método Marchant</span>
            </div>
            <Text variant="small" className="text-gray-400 leading-relaxed">
              Sistema Operativo para Producción de Capital Académico en Latinoamérica.
            </Text>
          </div>
          <div>
            <Heading level={4} className="text-white mb-4">
              Enlaces
            </Heading>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <NavItem href="#metodo" className="text-gray-400 hover:text-primary-400">
                  El Método
                </NavItem>
              </li>
              <li>
                <NavItem href="#pilares" className="text-gray-400 hover:text-primary-400">
                  6 Pilares
                </NavItem>
              </li>
              <li>
                <Link
                  to="/diagnostico"
                  className="text-gray-400 hover:text-primary-400 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded px-1"
                >
                  Diagnóstico Gratis
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <Heading level={4} className="text-white mb-4">
              Contacto
            </Heading>
            <ul className="space-y-2 text-sm text-gray-400" role="list">
              <li>
                <a
                  href="mailto:hola@marchant.com"
                  className="hover:text-primary-400 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded px-1"
                >
                  hola@marchant.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+569XXXXXXXX"
                  className="hover:text-primary-400 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded px-1"
                >
                  +56 9 XXXX XXXX
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Método Marchant. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
