import React, { useEffect, useState } from 'react'
import buildingsImage from '../assets/stan.jpg'
import { t } from '../i1n8'

function PonudeNudimo() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  // Poboljšana komponenta sa hover efektom i animacijom ulaska
  const ListItem = ({ text, delay }) => (
    <li 
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex items-start space-x-3 group transition-all duration-700 transform ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{text}</span>
    </li>
  )

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Suptilna pozadinska tekstura ili gradijent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-50/50 -skew-x-12 transform origin-top translate-x-20 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        
        {/* Tekstualni sadržaj */}
        <div className="relative z-10">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              {t('heading')}
            </h2>
            
            <div className="space-y-4 text-lg text-gray-600 mb-12 max-w-xl">
              <h3 className="text-2xl font-bold text-yellow-500 italic">{t('longTermTitle')}</h3>
              <p className="leading-relaxed">{t('p1')}</p>
              <p className="leading-relaxed">{t('p2')}</p>
              <p className="font-semibold text-gray-800">{t('p3')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Proces prodaje */}
            <div className="space-y-6">
              <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-gray-400 flex items-center gap-3">
                <span className="w-8 h-px bg-yellow-400"></span> {t('proces')}
              </h4>
              <ul className="grid grid-cols-1 gap-4">
                <ListItem delay={300} text={t('strucnaProcena')} />
                <ListItem delay={450} text={t('onalnaPrezentacija')} />
                <ListItem delay={600} text={t('selekcija')} />
                <ListItem delay={750} text={t('organizacijaPregovora')} />
                <ListItem delay={900} text={t('pravnaPodrska')} />
              </ul>
            </div>

            {/* Luksuzne nekretnine - Moderni Glass Card */}
            <div className={`transition-all duration-1000 delay-[1000ms] ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl shadow-yellow-500/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400"></div>
                <h5 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💎</span> {t('luxuzneNekretnine')}
                </h5>
                <p className="text-gray-600 leading-relaxed italic">
                 {t('gdesu')}<span className="text-gray-900 font-bold">{t('poverenje')}</span> {t('osnovni')}
                </p>
              </div>
            </div>

            {/* Zašto izabrati nas */}
            <div className="space-y-6">
               <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-gray-400 flex items-center gap-3">
                <span className="w-8 h-px bg-yellow-400"></span> {t('vasPartner')}
              </h4>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-1">
                  <span className="text-yellow-400">20+</span> {t('godinaIskustva')}
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-full font-semibold text-gray-700 shadow-sm hover:border-yellow-400 transition-colors cursor-default">
                  {t('inividualanPristup')}
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-full font-semibold text-gray-700 shadow-sm hover:border-yellow-400 transition-colors cursor-default">
                 {t('etickiStandardi')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vizuelni deo (Slika) */}
        <div className={`relative top-10 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="relative group">
            {/* Dekorativni okviri iza slike */}
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-yellow-200 rounded-[3rem] -z-10 group-hover:-top-4 group-hover:-right-4 transition-all duration-500"></div>
            
            <div className="rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src={buildingsImage}
                alt={t('imageAlt')}
                className="w-full h-[700px] object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Lebdeći info bedž */}
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-2xl shadow-2xl max-w-[240px] hidden md:block animate-bounce-slow">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Sigurnost</p>
              <p className="text-gray-900 font-extrabold text-lg leading-tight">100% garantovana pravna zaštita</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default PonudeNudimo