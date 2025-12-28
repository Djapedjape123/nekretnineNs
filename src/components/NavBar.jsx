import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { t } from '../i1n8'
import logo from '../assets/dedaci.jpg'

function NavBar() {
    const [open, setOpen] = useState(false)
    const [prodajaOpen, setProdajaOpen] = useState(false)
    const [izdavanjeOpen, setIzdavanjeOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // promena jezika
    const changeLang = (lang) => {
        localStorage.setItem('lang', lang)
        window.location.reload()
    }

    // prati scroll -> ako je skrolovano više od 10px, header postaje poluprovidan crni (sa blur-om)
    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navClass = ({ isActive }) =>
        isActive
            ? 'text-yellow-400 font-bold'
            : 'text-white hover:text-yellow-500 transition'

    const dropdownItemClass =
        'block px-4 py-2 text-white hover:text-yellow-400 transition'

    // helper: zatvori mobile meni (i podmenije) kada kliknemo link u dropdownu
    const closeAll = () => {
        setOpen(false)
        setProdajaOpen(false)
        setIzdavanjeOpen(false)
    }

    return (
        <header
            className={`top-0 left-0 w-full z-50 fixed transition-colors duration-300 ${
                isScrolled ? 'bg-black/40 backdrop-blur-sm' : 'bg-black'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="h-full flex items-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-full py-2 object-contain rounded-xl"
                    />
                </Link>

                {/* Desktop menu */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" end className={navClass}>{t('home')}</NavLink>

                    {/* Prodaja - klik na tip vodi na /prodaja + state filter */}
                    <div className="relative group">
                        <NavLink to="/prodaja" className={navClass}>{t('sales')}</NavLink>
                        <div className="absolute left-0 mt-2 w-48 bg-black/30 backdrop-blur-sm border border-yellow-500 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                            <Link to="/prodaja" state={{ filters: { type: 'apartment' } }} className={dropdownItemClass}> {t('stanovi')} </Link>
                            <Link to="/prodaja" state={{ filters: { type: 'house' } }} className={dropdownItemClass}> {t('kuce')} </Link>
                            <Link to="/prodaja" state={{ filters: { type: 'land' } }} className={dropdownItemClass}> {t('parcele') || 'Parcele'} </Link>
                            <Link to="/prodaja" state={{ filters: { type: 'office' } }} className={dropdownItemClass}> {t('poslovniProstor')}</Link>
                            <Link to="/prodaja" state={{ filters: { type: 'villa' } }} className={dropdownItemClass}> {t('vile')}</Link>
                        </div>
                    </div>

                    {/* Izdavanje - desktop: svaki link šalje state.filters.type = 'stan'|'kuca'|... */}
                    <div className="relative group">
                        <NavLink to="/izdavanje" className={navClass}>{t('rent')}</NavLink>
                        <div className="absolute left-0 mt-2 w-48 bg-black/30 backdrop-blur-sm border border-yellow-500 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                            <Link
                                to="/izdavanje"
                                state={{ filters: { type: 'stan' } }}
                                onClick={closeAll}
                                className={dropdownItemClass}
                            >
                                {t('stanovi')}
                            </Link>

                            <Link
                                to="/izdavanje"
                                state={{ filters: { type: 'kuca' } }}
                                onClick={closeAll}
                                className={dropdownItemClass}
                            >
                                {t('kuce')}
                            </Link>

                            <Link
                                to="/izdavanje"
                                state={{ filters: { type: 'zemljiste' } }}
                                onClick={closeAll}
                                className={dropdownItemClass}
                            >
                                {t('zemljiste') || 'Zemljišta'}
                            </Link>

                            <Link
                                to="/izdavanje"
                                state={{ filters: { type: 'poslovni' } }}
                                onClick={closeAll}
                                className={dropdownItemClass}
                            >
                                {t('poslovniProstor')}
                            </Link>

                            <Link
                                to="/izdavanje"
                                state={{ filters: { type: 'vila' } }}
                                onClick={closeAll}
                                className={dropdownItemClass}
                            >
                                {t('vile')}
                            </Link>
                        </div>
                    </div>

                    <NavLink to="/favorite" className={navClass}>{t('favorite')}</NavLink>
                    <NavLink to="/kontakt" className={navClass}>{t('contact')}</NavLink>
                </nav>

                {/* ZASTAVICE + CTA */}
                <div className="hidden md:flex items-center gap-2">
                    <button onClick={() => changeLang('sr')} title="Srpski">🇷🇸</button>
                    <button onClick={() => changeLang('ru')} title="Русский">🇷🇺</button>
                    <button onClick={() => changeLang('en')} title="English">🇬🇧</button>

                    <a
                        href="tel:+38163238564"
                        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
                    >
                        {t('cta')}
                    </a>
                </div>

                {/* Mobile button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-white text-2xl"
                    aria-label="toggle menu"
                >
                    ☰
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-black/95 border-t border-yellow-500 text-white">
                    <nav className="flex flex-col p-4 gap-4">
                        <NavLink onClick={() => setOpen(false)} to="/" className={navClass}>
                            {t('home')}
                        </NavLink>

                        {/* Mobile Prodaja - koristi state i zatvara meni */}
                        <button
                            onClick={() => setProdajaOpen(!prodajaOpen)}
                            className="flex justify-between items-center text-white hover:text-yellow-400"
                        >
                            {t('sales')}
                            <span>{prodajaOpen ? '−' : '+'}</span>
                        </button>

                        {prodajaOpen && (
                            <div className="pl-4 flex flex-col gap-2">
                                <Link to="/prodaja" state={{ filters: { type: 'apartment' } }} onClick={closeAll} className={dropdownItemClass}>{t('stanovi')}</Link>
                                <Link to="/prodaja" state={{ filters: { type: 'house' } }} onClick={closeAll} className={dropdownItemClass}>{t('kuce')}</Link>
                                <Link to="/prodaja" state={{ filters: { type: 'land' } }} onClick={closeAll} className={dropdownItemClass}>{t('parcele') || 'Parcele'}</Link>
                                <Link to="/prodaja" state={{ filters: { type: 'office' } }} onClick={closeAll} className={dropdownItemClass}>{t('poslovniProstor')}</Link>
                                <Link to="/prodaja" state={{ filters: { type: 'villa' } }} onClick={closeAll} className={dropdownItemClass}>{t('vile')}</Link>
                            </div>
                        )}

                        {/* Mobile Izdavanje - svaki link šalje state sa type i zatvara meni */}
                        <button
                            onClick={() => setIzdavanjeOpen(!izdavanjeOpen)}
                            className="flex justify-between items-center text-white hover:text-yellow-400"
                        >
                            {t('rent')}
                            <span>{izdavanjeOpen ? '−' : '+'}</span>
                        </button>

                        {izdavanjeOpen && (
                            <div className="pl-4 flex flex-col gap-2">
                                <Link to="/izdavanje" state={{ filters: { type: 'stan' } }} onClick={closeAll} className={dropdownItemClass}>{t('stanovi')}</Link>
                                <Link to="/izdavanje" state={{ filters: { type: 'kuca' } }} onClick={closeAll} className={dropdownItemClass}>{t('kuce')}</Link>
                                <Link to="/izdavanje" state={{ filters: { type: 'zemljiste' } }} onClick={closeAll} className={dropdownItemClass}>{t('zemljiste') || 'Zemljišta'}</Link>
                                <Link to="/izdavanje" state={{ filters: { type: 'poslovni' } }} onClick={closeAll} className={dropdownItemClass}>{t('poslovniProstor')}</Link>
                                <Link to="/izdavanje" state={{ filters: { type: 'vila' } }} onClick={closeAll} className={dropdownItemClass}>{t('vile')}</Link>
                            </div>
                        )}

                        <NavLink onClick={() => setOpen(false)} to="/favorite" className={navClass}>
                            {t('favorite')}
                        </NavLink>

                        <NavLink onClick={() => setOpen(false)} to="/kontakt" className={navClass}>
                            {t('contact')}
                        </NavLink>

                        <div className="flex gap-4 pt-2">
                            <button onClick={() => changeLang('sr')}>🇷🇸</button>
                            <button onClick={() => changeLang('ru')}>🇷🇺</button>
                            <button onClick={() => changeLang('en')}>🇬🇧</button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default NavBar
