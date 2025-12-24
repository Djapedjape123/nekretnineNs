import { FaFacebookF, FaInstagram, FaWhatsapp, FaViber } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { t } from '../i1n8' // importuj t funkciju

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-yellow-600/20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-400">

        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-yellow-400 tracking-wide">
            Serbes Nekretnine
          </h2>
          <p className="mt-1 text-sm leading-relaxed">
            {t('footerDescription')}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">
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
            <li>
              <Link
                to="/favorite"
                className="hover:text-yellow-400 transition"
              >
                {t('favorite')}
              </Link>
            </li>
            <li>
              <Link
                to="/kontakt"
                className="hover:text-yellow-400 transition"
              >
                {t('contact')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Korisne informacije (downloads + kontakti) */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('infoLinks') || 'Korisne informacije'}
          </h3>

          {/* downloads */}
          <div className="flex flex-col gap-3">
            <a
              href="/SERBES.docx"
              download
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-yellow-500 text-black rounded hover:opacity-95 transition"
            >
              Ugovor o posredovanju zakupa
            </a>

            <a
              href="/SERBESs.docx"
              download
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-yellow-500 text-black rounded hover:opacity-95 transition"
            >
              Ugovor o posredovanju za prodaju
            </a>

            <a
              href="https://new-direct.100m2.si/assets/eefe4d27-7d21-4aa8-8d42-f43720d37cb9.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-yellow-500 text-black rounded hover:opacity-95 transition"
            >
              Rešenje ministarstva
            </a>
          </div>

          {/* contact short */}
          <div className="pt-2 border-t border-yellow-600/10 mt-2">
            <h4 className="text-sm text-gray-300 mb-2 font-medium">Kontakt</h4>

            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:serbesnekretnine@gmail.com" className="flex items-center gap-3 hover:text-yellow-400 transition">
                <MdEmail color='purple' className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">serbesnekretnine@gmail.com</span>
              </a>

              <a href="tel:+381628150586" className="flex items-center gap-3 hover:text-yellow-400 transition">
                <MdPhone color='blue' className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">+381 62 815 0586</span>
              </a>

              <a
                className="flex items-start gap-3 hover:text-yellow-400 transition"
                href="https://www.google.com/maps/place/%D0%8B%D0%B8%D1%80%D0%BF%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0+37,+%D0%9D%D0%BE%D0%B2%D0%B8+%D0%A1%D0%B0%D0%B4/@45.252208,19.8133722,15z"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdLocationOn color='red' className="w-5 h-5 text-yellow-400 mt-0.5" />
                <span className="text-blue-500 ">{t('officeAddress')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">
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

          {/* small note */}
          <div className="pt-4 text-sm text-gray-400">
            <div>© {new Date().getFullYear()} Serbes Nekretnine.</div>
            <div className="text-gray-500">{t('footerRights')}</div>
          </div>
        </div>
      </div>

      {/* bottom thin bar (kept for compatibility) */}
      <div className="border-t border-yellow-600/10 py-2 text-center text-sm text-gray-500 md:hidden">
        © {new Date().getFullYear()} Serbes Nekretnine. {t('footerRights')}
      </div>
    </footer>
  )
}
