import React from 'react'
import { FaFacebookF, FaInstagram, FaWhatsapp, FaViber } from 'react-icons/fa'
import { FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { t } from '../i1n8' // importuj t funkciju

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Grid wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand + opis */}
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-yellow-400 tracking-wide">
              SERBES DOO NOVI SAD
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footerDescription')}
            </p>

            {/* Kratki kontakt ispod branda */}
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <a href="mailto:serbesnekretnine@gmail.com" className="flex items-center gap-3 hover:text-yellow-400 transition">
                <MdEmail className="w-5 h-5 text-yellow-400" />
                <span>serbesnekretnine@gmail.com</span>
              </a>

              <a href="tel:+381628150586" className="flex items-center gap-3 hover:text-yellow-400 transition">
                <MdPhone className="w-5 h-5 text-yellow-400" />
                <span>+381 62 815 0586</span>
              </a>
              <a href="tel:+38163238564" className="flex items-center gap-3 hover:text-yellow-400 transition">
                <MdPhone className="w-5 h-5 text-yellow-400" />
                <span>+381 63 238 564</span>
              </a>

              <a
                href="https://www.google.com/maps/place/%D0%8B%D0%B8%D1%80%D0%BF%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0+37,+%D0%9D%D0%BE%D0%B2%D0%B8+%D0%A1%D0%B0%D0%B4/@45.252208,19.8133722,15z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-yellow-400 transition"
              >
                <MdLocationOn className="w-5 h-5 text-yellow-400 mt-0.5" />
                <span className="text-blue-400">{t('officeAddress')}</span>
              </a>
            </div>
            
          </div>

          {/* Navigacija */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('footerNavigation')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/prodaja" className="hover:text-yellow-400 transition">
                  {t('sales')}
                </Link>
              </li>
              <li>
                <Link to="/izdavanje" className="hover:text-yellow-400 transition">
                  {t('rent')}
                </Link>
              </li>
              <li>
                <Link to="/favorite" className="hover:text-yellow-400 transition">
                  {t('favorite')}
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="hover:text-yellow-400 transition">
                  {t('contact')}
                </Link>
              </li>
            </ul>

            {/* Small divider + CTA */}

          </div>
          

          {/* Downloads / dokumenti */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('infoLinks') || 'Korisne informacije'}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <a
                href="/SERBES.docx"
                download
                className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-900/60 hover:bg-gray-900/40 rounded-md transition text-sm"
              >
                <span>{t('ugovor')}</span>
                <span className="text-yellow-400 font-semibold">PDF</span>
              </a>

              <a
                href="/SERBESs.docx"
                download
                className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-900/60 hover:bg-gray-900/40 rounded-md transition text-sm"
              >
                <span>{t('ugovor1')}</span>
                <span className="text-yellow-400 font-semibold">PDF</span>
              </a>

              <a
                href="https://new-direct.100m2.si/assets/eefe4d27-7d21-4aa8-8d42-f43720d37cb9.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-900/60 hover:bg-gray-900/40 rounded-md transition text-sm"
              >
                <span>{t('ugovor2')}</span>
                <span className="text-yellow-400 font-semibold">View</span>
              </a>

              <a
                href="/SERBES - usloviPos.doc"
                download
                className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-900/60 hover:bg-gray-900/40 rounded-md transition text-sm"
              >
                <span>{t('ugovor3')}</span>
                <span className="text-yellow-400 font-semibold">PDF</span>
              </a>
            </div>
          </div>

          {/* Naši oglasi + social */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{t('nasiOglasi')}</h3>

              <div>
                

                <div className="flex flex-col gap-3">
                  {[
                    { name: "4zida", url: "https://www.4zida.rs/agencije/novi-sad/serbes-nekretnine/412" },
                    { name: "Halo Oglasi", url: "https://www.halooglasi.com/nekretnine/prodaja-stanova/lux-namesten-penthaus-230m2-sa-bazenom-bul-ev/5425646119082?kid=1" },
                    { name: "Indomio", url: "https://www.indomio.rs/agencija/serbes-d.o.o./9751" },
                    { name: "Nadji Nekretnine", url: "https://www.indomio.rs/agencija/serbes-d.o.o./9751" }, // Proveri ovaj link, isti je kao Indomio
                    { name: "Nekretnine.rs", url: "https://nadjinekretnine.com/prodavci/agencija/1635/serbes-d-o-o" }
                  ].map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-between w-full px-5 py-3 bg-zinc-900 text-gray-300 rounded-lg overflow-hidden transition-all duration-300 hover:bg-yellow-400 hover:text-black  hover:shadow-lg hover:shadow-red-600/20 hover:-translate-y-0.5"
                    >
                      {/* Tekst koji se blago pomera desno */}
                      <span className="font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-1">
                        {link.name}
                      </span>

                      {/* Ikonica strelice koja se pojavljuje i pomera */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                {t('footerFollow')}
              </h3>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=100052694276212"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FaFacebookF size={18} />
                </a>

                <a
                  href="https://www.instagram.com/serbes_nekretnine/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <FaInstagram size={18} />
                </a>

                <a
                  href="https://wa.me/381628150586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </a>

                <a
                  href="viber://chat?number=%2B381628150586"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
                  aria-label="Viber"
                  title="Viber"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaViber size={18} />
                </a>
                <a
                  href="https://www.youtube.com/@draganacobanov7551"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-yellow-600/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
                  aria-label="YouTube"
                  title="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"

                >
                  <FaYoutube size={18} />
                </a>
              </div>
              

              {/* <div className="pt-6 text-sm text-gray-400">
                <div>© {new Date().getFullYear()} SERBES DOO NOVI SAD.</div>
                <div className="text-gray-500">{t('footerRights')}</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* developer credit - skroz dole, malo sivim slovima */}
      <div className="py-3 text-center text-sm text-gray-400">
        development by{' '}
        <a
          href="https://www.pedjadev.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-yellow-400 font-semibold"
        >
          prWeb
        </a>
      </div>

      {/* bottom thin bar */}
      <div className="border-t border-yellow-600/10 py-3 text-center text-sm text-gray-500 md:hidden">
        © {new Date().getFullYear()} Serbes Nekretnine. {t('footerRights')}
      </div>
    </footer>
  )
}
