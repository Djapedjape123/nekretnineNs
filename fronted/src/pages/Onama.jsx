import React, { useEffect, useState } from 'react'
import logo from '../assets/dedazi2.jpg'
import { t } from '../i1n8'

function ONama() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-black overflow-hidden">
      {/* Suptilni dekorativni element u pozadini */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">

        {/* LEVA STRANA: SLIKA SA MODERNIM OKVIROM */}
        <div
          className={`transition-all duration-1000 ease-out transform lg:w-1/2 w-full ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <div className="relative group">
            {/* Lebdeći ram iza slike koji daje dubinu */}
            <div className="absolute -inset-4 border border-yellow-400/20 rounded-[2.5rem] transform group-hover:scale-105 transition-transform duration-700"></div>
            
            <div className="relative overflow-hidden rounded-[2rem] bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5">
              <img
                src={logo}
                alt="Logo firme"
                className="w-full h-auto max-h-[500px] object-contain p-6 transform transition-transform duration-[2s] group-hover:scale-105"
              />
              {/* Overlay koji sprečava da slika bude previše "oštra" u odnosu na mrak */}
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* DESNA STRANA: MODERNIZOVAN TEKST */}
        <div
          className={`transition-all duration-1000 ease-out delay-300 transform lg:w-1/2 w-full ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}
        >
          {/* Badge iznad naslova */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-yellow-600 text-xs font-bold uppercase tracking-[0.2em]">Naša Priča</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-yellow-400 mb-8 tracking-tight leading-tight">
            {t('onama')}
          </h2>

          <div className="space-y-8">
            {/* Tekst 1 sa jačim fontom za bolju čitljivost na prelazu gradijenta */}
            <p className="text-gray-700 font-medium text-xl leading-relaxed lg:text-gray-300 transition-colors duration-1000">
              {t('tekst1')}
            </p>

            {/* Tekst 2 u "Glass" kartici radi preglednosti */}
            <div className="relative p-8 bg-white/5 backdrop-blur-sm border-l-4 border-yellow-500 rounded-r-2xl shadow-xl">
              <p className="text-gray-300 text-lg leading-relaxed italic opacity-90">
                {t('tekst2')}
              </p>
              {/* Navodnik dekoracija */}
              <span className="absolute top-2 right-6 text-6xl text-yellow-500/10 font-serif">"</span>
            </div>
          </div>

          {/* Slogan na dnu za kraj sekcije */}
          <div className="mt-12 flex items-center gap-4">
             <div className="h-px w-12 bg-yellow-500/50"></div>
             <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
               Sigurnost • Poverenje • Tradicija
             </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ONama