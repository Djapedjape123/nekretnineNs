import { FaFacebookF, FaInstagram, FaWhatsapp, FaViber } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { t } from '../i1n8' // importuj t funkciju

export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-600/20 mt-0">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-400">

        
        <div>
          <h2 className="text-2xl font-extrabold text-yellow-400 tracking-wide">
            Serbes Nekretnine
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            {t('footerDescription')}
          </p>
        </div>

       
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('footerNavigation')}
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/prodaja"
                className="hover:text-yellow-400 transition"
              >
                {t('sales')}
              </Link>
            </li>
            <li>
              <Link
                to="/izdavanje"
                className="hover:text-yellow-400 transition"
              >
                {t('rent')}
              </Link>
            </li>
          </ul>
        </div>

        {/* mreze */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('footerFollow')}
          </h3>

          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=100052694276212"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              aria-label="Facebook"
              title="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/serbes_nekretnine/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://wa.me/381628150586"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              aria-label="WhatsApp"
              title="WhatsApp: +381628150586"
            >
              <FaWhatsapp />
            </a>

            <a
              href="viber://chat?number=%2B381628150586"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              aria-label="Viber"
              title="Viber: +381628150586"
            >
              <FaViber />
            </a>
          </div>

        </div>
      </div>

      
      <div className="border-t border-yellow-600/10 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Serbes Nekretnine. {t('footerRights')}
      </div>
    </footer>
  )
}
