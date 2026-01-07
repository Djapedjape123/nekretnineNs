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
                <div className="md:hidden fixed inset-x-0 top-20 bg-black/95 backdrop-blur-xl border-t border-yellow-500/50 text-white min-h-screen z-[60] animate-in fade-in slide-in-from-top duration-300">
                    <nav className="flex flex-col p-3 gap-1">

                        {/* Početna */}
                        <NavLink
                            to="/"
                            onClick={closeAll}
                            className={({ isActive }) =>
                                `flex items-center py-3 px-4 rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-sm border border-transparent hover:border-yellow-500/20 ${isActive ? 'text-yellow-400 font-bold' : 'text-white'
                                }`
                            }
                        >
                            {t('home')}
                        </NavLink>

                        {/* Mobile Prodaja */}
                        <div className="flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5 mt-2">
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer hover:bg-yellow-500/10 transition-colors"
                                onClick={() => { setProdajaOpen(!prodajaOpen); setIzdavanjeOpen(false); }}
                            >
                                <span className="font-bold uppercase tracking-wider text-yellow-400">{t('sales')}</span>
                                <span className={`text-xl transition-transform duration-300 ${prodajaOpen ? 'rotate-180 text-yellow-400' : 'text-gray-500'}`}>
                                    {prodajaOpen ? '−' : '+'}
                                </span>
                            </div>

                            {prodajaOpen && (
                                <div className="flex flex-col gap-1 pb-4 px-4 animate-in slide-in-from-top-2 duration-200">
                                    <Link to="/prodaja" state={{ type: 'stan' }} onClick={closeAll} className={`${dropdownItemClass} rounded-lg`}> {t('stanovi')} </Link>
                                    <Link to="/prodaja" state={{ type: 'kuca' }} onClick={closeAll} className={`${dropdownItemClass} rounded-lg`}> {t('kuce')} </Link>
                                    <Link to="/prodaja" state={{ type: 'plac' }} onClick={closeAll} className={`${dropdownItemClass} rounded-lg`}> {t('parcele') || 'Parcele'} </Link>
                                    <Link to="/prodaja" state={{ type: 'poslovni' }} onClick={closeAll} className={`${dropdownItemClass} rounded-lg`}> {t('poslovniProstor')}</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Izdavanje */}
                        <div className="flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5 mt-2">
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer hover:bg-yellow-500/10 transition-colors"
                                onClick={() => { setIzdavanjeOpen(!izdavanjeOpen); setProdajaOpen(false); }}
                            >
                                <span className="font-bold uppercase tracking-wider text-yellow-400">{t('rent')}</span>
                                <span className={`text-xl transition-transform duration-300 ${izdavanjeOpen ? 'rotate-180 text-yellow-400' : 'text-gray-500'}`}>
                                    {izdavanjeOpen ? '−' : '+'}
                                </span>
                            </div>

                            {izdavanjeOpen && (
                                <div className="flex flex-col gap-1 pb-4 px-4 animate-in slide-in-from-top-2 duration-200">
                                    <Link to="/izdavanje" state={{ type: 'stan' }} onClick={closeAll} className={`${dropdownItemClass} rounded-lg`}>{t('stanovi')}</Link>
                                    <Link to="/izdavanje" state={{ type: 'kuca' }} onClick={closeAll} className={`${dropdownItemClass} rounded-lg`}>{t('kuce')}</Link>
                                    <Link to="/izdavanje" state={{ type: 'poslovni' }} onClick={closeAll} className={`${dropdownItemClass} rounded-lg`}>{t('poslovniProstor')}</Link>
                                </div>
                            )}
                        </div>

                        {/* Ostali Linkovi */}
                        <div className="flex flex-col gap-2 mt-4">
                            <NavLink
                                to="/favorite"
                                onClick={closeAll}
                                className={({ isActive }) =>
                                    `flex items-center py-3 px-4 rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-sm ${isActive ? 'text-yellow-400 font-bold' : 'text-white'
                                    }`
                                }
                            >
                                {t('favorite')}
                            </NavLink>

                            <NavLink
                                to="/kontakt"
                                onClick={closeAll}
                                className={({ isActive }) =>
                                    `flex items-center py-3 px-4 rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest text-sm ${isActive ? 'text-yellow-400 font-bold' : 'text-white'
                                    }`
                                }
                            >
                                {t('contact')}
                            </NavLink>
                        </div>

                        {/* Donji deo: Jezici i CTA */}
                        <div className="mt-auto pt-8 flex flex-col gap-6">
                            <div className="flex justify-center gap-6 items-center bg-white/5 py-4 rounded-2xl border border-white/5">
                                <button onClick={() => changeLang('sr')} className="text-2xl hover:scale-125 transition-transform">🇷🇸</button>
                                <button onClick={() => changeLang('ru')} className="text-2xl hover:scale-125 transition-transform">🇷🇺</button>
                                <button onClick={() => changeLang('en')} className="text-2xl hover:scale-125 transition-transform">🇺🇸</button>
                            </div>

                            <a
                                href="tel:+38163238564"
                                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black py-4 rounded-2xl text-center font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
                            >
                                {t('cta')}
                            </a>
                        </div>
                    </nav>
                </div>
            )}

        </header>
    )
}

export default NavBar