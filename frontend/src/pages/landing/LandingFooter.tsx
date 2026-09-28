import { Link } from 'react-router'
import { useDemoStore } from '@/store/demo'

export function LandingFooter() {
  const categories = useDemoStore((s) => s.categories)
  const supportEmail = useDemoStore((s) => s.settings.supportEmail)

  return (
    <footer className="bg-primary text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-heading text-xl font-bold tracking-[0.2em] text-white">DOMUS</p>
          <p className="mt-2 text-sm">Conectamos tu hogar con soluciones.</p>
        </div>
        <nav aria-label="Servicios">
          <h2 className="font-heading text-sm font-semibold text-white">Servicios</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/servicios/${c.id}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Domus">
          <h2 className="font-heading text-sm font-semibold text-white">Domus</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/#como-funciona" className="hover:text-white">
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link to="/para-profesionales" className="hover:text-white">
                Soy profesional
              </Link>
            </li>
            <li>
              <Link to="/para-profesionales#planes" className="hover:text-white">
                Planes para profesionales
              </Link>
            </li>
            <li>
              <Link to="/ingresar" className="hover:text-white">
                Ingresar
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="font-heading text-sm font-semibold text-white">Contacto</h2>
          <p className="mt-3 text-sm">{supportEmail}</p>
          <p className="text-sm">Asunción, Paraguay</p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/70 sm:px-6 lg:px-8">
          Demo académica: los datos, profesionales y pagos son ficticios. Fotos de Unsplash.
        </p>
      </div>
    </footer>
  )
}
