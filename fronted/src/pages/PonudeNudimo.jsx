import React, { useEffect, useState } from 'react'
import buildingsImage from '../assets/zgrada.jpg'
import { t } from '../i1n8'

function PonudeNudimo() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100) // delay da se animacija pokrene
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="relative py-20 bg-gradient-to-b from-yellow-100 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Tekst levo */}
        <div
          className={`transition-all duration-1000 ease-out transform ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8">
            {t('offers.heading')}
          </h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {t('offers.longTermTitle')}
          </h3>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('offers.p1')}
          </p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {t('offers.p2')}
          </p>

          <p className="text-gray-700 leading-relaxed">
            {t('offers.p3')}
          </p>
        </div>

        {/* Slika desno */}
        <div
          className={`relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ease-out transform ${
            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}
        >
          <img
            src={buildingsImage}
            alt={t('offers.imageAlt')}
            className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

      </div>
    </section>
  )
}

export default PonudeNudimo
