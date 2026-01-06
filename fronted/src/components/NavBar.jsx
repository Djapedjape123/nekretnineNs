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

    // prati scroll
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
        'block px-4 py-2 text-white hover:text-yellow-400 transition hover:bg-white/5'

    // helper: zatvori mobile meni (i podmenije) i resetuj navigaciju
    const closeAll = () => {
        setOpen(false)
        setProdajaOpen(false)
        setIzdavanjeOpen(false)
    }

    return (
        <header
            className={`top-0 left-0 w-full z-50 fixed transition-colors duration-300 ${isScrolled ? 'bg-black/40 backdrop-blur-sm' : 'bg-black'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="h-full flex items-center" onClick={closeAll}>
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-full py-2 object-contain rounded-xl"
                    />
                </Link>

                {/* Desktop menu */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" end className={navClass}>{t('home')}</NavLink>

                    {/* Prodaja Dropdown */}
                    <div className="relative group">
                        <NavLink to="/prodaja" className={navClass} onClick={() => closeAll()}>{t('sales')}</NavLink>
                        <div className="absolute left-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-yellow-500 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                            {/* Ključna izmena: Koristimo proste stringove za tipove koji se lako filtriraju u ProdajaPage */}
                            <Link to="/prodaja" state={{ type: 'stan' }} onClick={closeAll} className={dropdownItemClass}> {t('stanovi')} </Link>
                            <Link to="/prodaja" state={{ type: 'kuca' }} onClick={closeAll} className={dropdownItemClass}> {t('kuce')} </Link>
                            <Link to="/prodaja" state={{ type: 'plac' }} onClick={closeAll} className={dropdownItemClass}> {t('parcele') || 'Parcele'} </Link>
                            <Link to="/prodaja" state={{ type: 'poslovni' }} onClick={closeAll} className={dropdownItemClass}> {t('poslovniProstor')}</Link>
                            <Link to="/prodaja" state={{ type: 'vila' }} onClick={closeAll} className={dropdownItemClass}> {t('vile')}</Link>
                        </div>
                    </div>

                    {/* Izdavanje Dropdown */}
                    {/* Izdavanje Dropdown - ISPRAVLJENO */}
                    <div className="relative group">
                        <NavLink to="/izdavanje" className={navClass} onClick={() => closeAll()}>{t('rent')}</NavLink>
                        <div className="absolute left-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-yellow-500 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                            {/* Šaljemo direktno type: 'stan', isto kao u prodaji */}
                            <Link to="/izdavanje" state={{ type: 'stan' }} onClick={closeAll} className={dropdownItemClass}>{t('stanovi')}</Link>
                            <Link to="/izdavanje" state={{ type: 'kuca' }} onClick={closeAll} className={dropdownItemClass}>{t('kuce')}</Link>
                            <Link to="/izdavanje" state={{ type: 'poslovni' }} onClick={closeAll} className={dropdownItemClass}>{t('poslovniProstor')}</Link>
                            <Link to="/izdavanje" state={{ type: 'vila' }} onClick={closeAll} className={dropdownItemClass}>{t('vile')}</Link>
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
                        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition font-bold"
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
                <div className="md:hidden bg-black/95 border-t border-yellow-500 text-white min-h-screen">
                    <nav className="flex flex-col p-4 gap-4">
                        <NavLink onClick={closeAll} to="/" className={navClass}>
                            {t('home')}
                        </NavLink>

                        {/* Mobile Prodaja */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center" onClick={() => setProdajaOpen(!prodajaOpen)}>
                                <NavLink to="/prodaja" onClick={closeAll} className={navClass}>{t('sales')}</NavLink>
                                <span className="text-xl px-4">{prodajaOpen ? '−' : '+'}</span>
                            </div>
                            {prodajaOpen && (
                                <div className="pl-4 flex flex-col gap-2 mt-2 border-l border-yellow-500/30">
                                    <Link to="/prodaja" state={{ type: 'stan' }} onClick={closeAll} className={dropdownItemClass}>{t('stanovi')}</Link>
                                    <Link to="/prodaja" state={{ type: 'kuca' }} onClick={closeAll} className={dropdownItemClass}>{t('kuce')}</Link>
                                    <Link to="/prodaja" state={{ type: 'plac' }} onClick={closeAll} className={dropdownItemClass}>{t('parcele')}</Link>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center" onClick={() => setIzdavanjeOpen(!izdavanjeOpen)}>
                                    <NavLink to="/izdavanje" onClick={closeAll} className={navClass}>{t('rent')}</NavLink>
                                    <span className="text-xl px-4 text-white">{izdavanjeOpen ? '−' : '+'}</span>
                                </div>
                                {izdavanjeOpen && (
                                    <div className="pl-4 flex flex-col gap-2 mt-2 border-l border-yellow-500/30">
                                        <Link to="/izdavanje" state={{ filters: { type: 'stan' } }} onClick={closeAll} className={dropdownItemClass}>{t('stanovi')}</Link>
                                        <Link to="/izdavanje" state={{ filters: { type: 'kuca' } }} onClick={closeAll} className={dropdownItemClass}>{t('kuce')}</Link>
                                        <Link to="/izdavanje" state={{ filters: { type: 'poslovni' } }} onClick={closeAll} className={dropdownItemClass}>{t('poslovniProstor')}</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <NavLink onClick={closeAll} to="/favorite" className={navClass}>
                            {t('favorite')}
                        </NavLink>

                        <NavLink onClick={closeAll} to="/kontakt" className={navClass}>
                            {t('contact')}
                        </NavLink>

                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <button onClick={() => changeLang('sr')}>🇷🇸</button>
                            <button onClick={() => changeLang('ru')}>🇷🇺</button>
                            <button onClick={() => changeLang('en')}>🇺🇸</button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default NavBar