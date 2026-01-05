import React, { useState, useEffect } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { t } from '../i1n8'

// Mock podaci
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Moderan stan u centru, Beograd',
    price: '450 €/mesec',
    location: 'Beograd, Vračar',
    size: 75,
    rooms: 2,
    baths: 1,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=5bf4a8b1f2f7f124e2d7b6d1f4e3a2c1',
  },
  {
    id: 2,
    title: 'Jednosoban stan blizu fakulteta',
    price: '320 €/mesec',
    location: 'Novi Sad, Centar',
    size: 48,
    rooms: 1,
    baths: 1,
    image:
      'https://images.unsplash.com/photo-1560448204-5a3f3d5b1b9f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=c4e5d6f7a8b9c0d1e2f3a4b5c6d7e8f9',
  },
  {
    id: 3,
    title: 'Kuća sa dvorištem za izdavanje',
    price: '700 €/mesec',
    location: 'Novi Sad, Petrovaradin',
    size: 120,
    rooms: 3,
    baths: 2,
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d',
  },
]

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
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black font-bold px-3 py-1 rounded-md shadow">
                    {item.price}
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
                      onClick={() =>  navigate(`/single/${item.id}`)}
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
