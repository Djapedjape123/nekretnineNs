import React, { useEffect, useState } from 'react'
import logo from '../assets/dedaci.jpg' // ubaci svoj logo
import { t } from '../i1n8'

function ONama() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        
        {/* SLIKA VEĆA LEVO */}
        <div
          className={`transition-all duration-1000 ease-out transform md:w-3/5 w-full ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
        >
          <img
            src={logo}
            alt="Logo firme"
            className="w-full h-96 md:h-[580px] object-cover rounded-3xl shadow-2xl mx-auto"
          />
        </div>

        {/* SUŽENI TEKST DESNO */}
        <div
          className={`transition-all duration-1000 ease-out transform md:w-2/5 w-full md:max-w-md ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-6">
           {t('onama')}
          </h2>

          <p className="text-gray-200 mb-4 leading-relaxed text-lg">
            {t('tekst1')}
          </p>

          <p className="text-gray-200 leading-relaxed text-lg">
           {t('tekst2')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ONama
