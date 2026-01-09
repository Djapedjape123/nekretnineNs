import React, { useState, useEffect } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { t } from '../i1n8'

// Ako želiš, možeš obrisati MOCK_PROPERTIES — ne koristi se za favorite listu.

export default function FavoritePage() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const navigate = useNavigate()

  const tt = (key, fallback) => {
    try {
      const val = t(key)
      return val === key ? fallback : val
    } catch {
      return fallback
    }
  }

  const toggleFavorite = (property) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === property.id)
      const updated = exists
        ? prev.filter((p) => p.id !== property.id)
        : [...prev, property]

      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }

  // === ANIMATION TRIGGER ===
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(id)
  }, [])

  const formatPrice = (value) => {
    if (value === null || value === undefined) return ''

    // Pretvori u string i ukloni sve što nije cifra, tačka ili zarez
    let s = String(value)
    // Ako ima euro znak ili razmak, ukloni ih (ostavi samo cifre i . i ,)
    s = s.replace(/[^\d.,-]/g, '')

    if (!s) return ''

    // Najjednostavniji i siguran pristup za cene: uklonimo sve separatorе (tačke i zareze)
    // i parsiramo kao ceo broj (većina oglasa koristi cele evre).
    const onlyDigits = s.replace(/[.,]/g, '')

    const num = Number(onlyDigits)
    if (isNaN(num)) return value

    // Formatiraj za srpsko tržište: 319300 -> 319.300
    return new Intl.NumberFormat('sr-RS').format(num)
  }




  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mt-10 md:text-4xl font-extrabold tracking-tight text-yellow-400 mb-6">
          {tt('favoritesTitle', 'Omiljene nekretnine')}
        </h1>

        {favorites.length === 0 ? (
          <p className="text-gray-300 text-lg">
            {tt('noFavorites', 'Još nema sačuvanih nekretnina.')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item, index) => (
              <article
                key={item.id}
                style={{ transitionDelay: `${index * 80}ms` }}
                className={
                  `group bg-gradient-to-br from-gray-900 to-black border border-yellow-600/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-700 ` +
                  (visible
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-10 opacity-0')
                }
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 bg-yellow-400 text-black px-4 py-1 rounded-lg font-black text-xl">
                    {formatPrice(item.cena || item.price)}
                  </div>

                  <button
                    onClick={() => toggleFavorite(item)}
                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/30 p-2 rounded-full text-yellow-400 transition"
                    aria-label="favorite"
                  >
                    <FiHeart className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>

                  <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
                    <MdLocationOn className="w-4 h-4 text-yellow-400" />
                    <span>{item.location}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FaBed className="text-yellow-400 w-4 h-4" />
                        <span>{item.rooms} {tt('rooms', 'sobe')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBath className="text-yellow-400 w-4 h-4" />
                        <span>{item.baths} {tt('baths', 'kupatila')}</span>
                      </div>
                      <div className="px-2 py-1 bg-black/30 rounded text-xs border border-yellow-600/10">
                        {item.size} m²
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      className="flex-1 bg-transparent border border-yellow-600/30 text-yellow-400 py-2 rounded-md hover:bg-yellow-600/10 transition"
                      onClick={() => navigate(`/single/${item.id}`)}
                    >
                      {tt('details', 'Detalji')}
                    </button>

                    <a
                      href={`mailto:serbesnekretnine@gmail.com?subject=Zainteresovan za: ${encodeURIComponent(
                        item.title
                      )}`}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
                    >
                      {tt('contactBtn', 'Kontakt')}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
