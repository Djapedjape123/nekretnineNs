import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../i1n8'   // ⬅️ DODATO

function NavBar() {
    const [open, setOpen] = useState(false)

    const changeLang = (lang) => {
        localStorage.setItem('lang', lang)
        window.location.reload()
    }

    return (
        <header className="top-0 left-0 w-full z-50 bg-black fixed" >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-yellow-500">
                    Serbes<span className="text-white">Nekretnine</span>
                </Link>

                {/* Desktop menu */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-white hover:text-yellow-500">{t('home')}</Link>
                    <Link to="/prodaja" className="text-white hover:text-yellow-500">{t('sales')}</Link>
                    <Link to="/izdavanje" className="text-white hover:text-yellow-500">{t('rent')}</Link>
                    <Link to="/favorite" className="text-white hover:text-yellow-500">{t('favorite')}</Link>
                    <Link to="/kontakt" className="text-white hover:text-yellow-500">{t('contact')}</Link>
                </nav>

                {/* ZASTAVICE + CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Flags */}
                    <button onClick={() => changeLang('sr')} title="Srpski">🇷🇸</button>
                    <button onClick={() => changeLang('ru')} title="Русский">🇷🇺</button>
                    <button onClick={() => changeLang('en')} title="English">🇬🇧</button>

                    {/* CTA */}
                    <a
                        href="tel:+38163238564"
                        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
                    >
                        {t('cta')}
                    </a>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-white text-2xl"
                >
                    ☰
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-black/90 border-t border-yellow-500 text-white">
                    <nav className="flex flex-col p-4 gap-4">
                        <Link onClick={() => setOpen(false)} to="/">{t('home')}</Link>
                        <Link onClick={() => setOpen(false)} to="/prodaja">{t('sales')}</Link>
                        <Link onClick={() => setOpen(false)} to="/izdavanje">{t('rent')}</Link>
                        <Link onClick={() => setOpen(false)} to="/favorite">{t('favorite')}</Link>
                        <Link onClick={() => setOpen(false)} to="/kontakt">{t('contact')}</Link>

                        {/* Mobile flags */}
                        <div className="flex gap-4 mt-2">
                            <button onClick={() => changeLang('sr')}>🇷🇸</button>
                            <button onClick={() => changeLang('ru')}>🇷🇺</button>
                            <button onClick={() => changeLang('en')}>🇬🇧</button>
                        </div>

                        <a
                            href="tel:+38163238564"
                            className="bg-yellow-500 text-black px-4 py-2 rounded mt-3"
                        >
                            {t('cta')}
                        </a>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default NavBar
