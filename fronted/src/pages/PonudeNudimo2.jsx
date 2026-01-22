import React, { useEffect, useState } from 'react'
import buildingsImage from '../assets/prvi22.webp'
import { t } from '../i1n8'
import { TbTargetArrow } from "react-icons/tb";

function PonudeNudimo2() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  const services = t('services.servicesItems')

  return (
    <section className="relative py-24 bg-[#fcfcfc] overflow-hidden">
      {/* Dekorativni pozadinski elementi */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">


        {/* Tekstualni sadržaj (Levo) */}
        <div
          className={`transition-all duration-1000 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h2 className="text-xl md:text-6xl font-black text-gray-900 ">
            {t('heading')}
          </h2>

          <h2 className="text-4xl md:text-6xl  text-yellow-400-900 mb-6 leading-tight">
            {t('p3')}
          </h2>

          <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-10">
            <p className="text-2xl font-bold text-yellow-500 italic">{t('longTermTitle2')}</p>
            <p>{t('i1')}</p>
            <p>{t('i2')}</p>
            <p>{t('i3')}</p>
          </div>

          {/* Sekcija: Usluge sa animacijom */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900 mb-6">{t('services.servicesHeading')}</h4>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  className={`group flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-yellow-300 transition-all duration-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
                    }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-200 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-4 font-semibold text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Naš Cilj - Moderni "Callout" */}
          <div className={`mt-12 p-8 bg-gray-900 rounded-[2rem] text-white relative overflow-hidden transition-all duration-1000 delay-[800ms] ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl"><TbTargetArrow /></span>
                <h5 className="text-xl font-bold text-yellow-400 tracking-wide uppercase">{t('nasCilji')}</h5>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed italic">
                {t('dugorocna')}
              </p>
            </div>
            {/* Dekorativni krug u uglu kartice */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Vizuelni deo (Desno) */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
            <img
              src={buildingsImage}
              alt={t('imageAlt2')}
              className="w-full h-[600px] object-cover hover:scale-110 transition duration-[2s] ease-out"
            />
            {/* Overlay gradijent preko slike */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Bedž na slici */}
            <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <p className="text-white font-medium text-center italic leading-snug">
                {t('pronadji')}
              </p>
            </div>
          </div>

          {/* Geometrijski ukras iza slike */}
          <div className="absolute -top-6 -right-6 w-full h-full border-2 border-yellow-400 rounded-[3.5rem] -z-10"></div>
        </div>

      </div>
    </section>
  )
}

export default PonudeNudimo2