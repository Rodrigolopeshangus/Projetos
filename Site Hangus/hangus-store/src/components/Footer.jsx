import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-serif text-2xl text-white tracking-widest mb-3">HANGUS</p>
          <p className="text-white/40 text-sm leading-relaxed">
            Carnes premium selecionadas com rigor, entregues na sua porta.
          </p>
        </div>

        <div>
          <p className="text-gold text-xs uppercase tracking-widest mb-4">Navegação</p>
          <ul className="space-y-2">
            {[['/', 'Início'], ['/shop', 'Catálogo'], ['/login', 'A minha conta']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-gold text-xs uppercase tracking-widest mb-4">Contacto</p>
          <ul className="space-y-2 text-white/50 text-sm">
            <li>info@hangus.pt</li>
            <li>+351 XXX XXX XXX</li>
            <li>Portugal</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-4 text-center text-white/20 text-xs">
        © {new Date().getFullYear()} Hangus. Todos os direitos reservados.
      </div>
    </footer>
  )
}
