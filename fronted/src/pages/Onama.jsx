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
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Suptilni crveni dekorativni element u pozadini */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">

        {/* LEVA STRANA: SLIKA (Crni okvir sa crvenim detaljima) */}
        <div
          className={`transition-all duration-1000 ease-out transform lg:w-1/2 w-full ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <div className="relative group">
            {/* Lebdeći ram iza slike - sada crvenkast */}
            <div className="absolute -inset-4 border border-red-600/20 rounded-[2.5rem] transform group-hover:scale-105 transition-transform duration-700"></div>
            
            {/* Crna pozadina oko slike za "Black & Red" osećaj */}
            <div className="relative overflow-hidden rounded-[2rem] bg-black shadow-[0_20px_50px_-15px_rgba(220,38,38,0.3)] border border-gray-800">
              <img
                src={logo}
                alt="Logo firme"
                className="w-full h-auto max-h-[500px] object-contain p-6 transform transition-transform duration-[2s] group-hover:scale-105"
              />
              {/* Overlay unutar slike */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-900/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* DESNA STRANA: TEKST (Tamno na belom za čitljivost) */}
        <div
          className={`transition-all duration-1000 ease-out delay-300 transform lg:w-1/2 w-full ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}
        >
          {/* Badge iznad naslova - Crvena varijanta */}
          

          {/* Naslov - Jaka crna boja */}
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
            {t('onama')}
            <span className="text-yellow-400">.</span> {/* Dekorativna tačka */}
          </h2>

          <div className="space-y-8">
            {/* Tekst 1 - Tamno siva za maksimalnu čitljivost na belom */}
            <p className="text-gray-700 font-medium text-xl leading-relaxed">
              {t('tekst1')}
            </p>

            {/* Tekst 2 - Kartica koja je sada svetla, a ne "glass" efekat */}
            <div className="relative p-8 bg-gray-50 border-l-4 border-yellow-400 rounded-r-2xl shadow-md">
              <p className="text-gray-800 text-lg leading-relaxed italic opacity-90">
                {t('tekst2')}
              </p>
              {/* Navodnik dekoracija - crvena */}
              <span className="absolute top-2 right-6 text-6xl text-red-600/10 font-serif">"</span>
            </div>
          </div>

          {/* Slogan na dnu - Crni tekst sa crvenom linijom */}
          <div className="mt-12 flex items-center gap-4">
             <div className="h-px w-12 bg-yellow-400"></div>
             <p className="text-gray-900 text-xs uppercase tracking-widest font-bold">
               {t('sigurnost')}  • {t('tradicija')}
             </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ONama