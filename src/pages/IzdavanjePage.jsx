import React, { useState, useEffect } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { t } from '../i1n8'

const MOCK_RENTALS = [
  {
    id: 1,
    title: 'Moderan stan u centru, Beograd',
    price: '450 €/mesec',
    location: 'Beograd, Vračar',
    size: 75,
    rooms: 2,
    baths: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 2,
    title: 'Jednosoban stan blizu fakulteta',
    price: '320 €/mesec',
    location: 'Novi Sad, Centar',
    size: 48,
    rooms: 1,
    baths: 1,
    image: 'https://images.unsplash.com/photo-1560448204-5a3f3d5b1b9f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 3,
    title: 'Kuća sa dvorištem za izdavanje',
    price: '700 €/mesec',
    location: 'Novi Sad, Petrovaradin',
    size: 120,
    rooms: 3,
    baths: 2,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 4,
    title: 'Lux apartman sa pogledom na Dunav',
    price: '550 €/mesec',
    location: 'Beograd, Dorćol',
    size: 65,
    rooms: 2,
    baths: 1,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
]

export default function IzdavanjePage() {
  const navigate = useNavigate()

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [selectedCity, setSelectedCity] = useState('all')

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const cities = Array.from(
    new Set(MOCK_RENTALS.map((r) => r.location.split(',')[0].trim()))
  )

  const filteredRentals =
    selectedCity === 'all'
      ? MOCK_RENTALS
      : MOCK_RENTALS.filter((r) =>
          r.location.toLowerCase().includes(selectedCity.toLowerCase())
        )

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  const toggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      setFavorites((prev) => prev.filter((f) => f.id !== item.id))
    } else {
      setFavorites((prev) => [...prev, item])
      navigate('/favorite')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* FILTER + HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="bg-black/60 border border-yellow-600/20 rounded-md p-3 w-fit">
            <label className="text-xs text-gray-300 block mb-1">Grad</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-black text-white p-2 rounded-md focus:outline-none"
            >
              <option value="all">{t('showCity', 'Prikaži grad')}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400">
              {t('rentTitle', 'Nekretnine za izdavanje')}
            </h1>
            
          </div>

          <div className="text-sm text-gray-400">
            Pronađeno:{' '}
            <span className="text-yellow-400 font-semibold">
              {filteredRentals.length}
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((item) => (
            <article
              key={item.id}
              className="group bg-gradient-to-br from-gray-900 to-black border border-yellow-600/10 rounded-xl overflow-hidden shadow-xl hover:-translate-y-2 transition"
            >
              <div className="relative h-56">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute top-3 left-3 bg-yellow-400 text-black font-bold px-3 py-1 rounded">
                  {item.price}
                </div>

                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
                >
                  <FiHeart
                    className={`w-5 h-5 ${
                      isFavorite(item.id) ? 'text-red-400' : 'text-yellow-400'
                    }`}
                  />
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg">{item.title}</h3>

                <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                  <MdLocationOn className="text-yellow-400" />
                  {item.location}
                </div>

                <div className="flex gap-4 text-sm text-gray-300 mt-4">
                  <span className="flex items-center gap-1">
                    <FaBed className="text-yellow-400" /> {item.rooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaBath className="text-yellow-400" /> {item.baths}
                  </span>
                  <span className="text-xs border border-yellow-600/20 px-2 py-1 rounded">
                    {item.size} m²
                  </span>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    className="flex-1 border border-yellow-600/30 text-yellow-400 py-2 rounded hover:bg-yellow-600/10"
                    onClick={() => navigate(`/single/${item.id}`)} // ← OVDE: navigacija ka single stranici
                  >
                    {t('details', 'Detalji')}
                  </button>

                  <a
                    href={`mailto:serbesnekretnine@gmail.com?subject=Zainteresovan za: ${encodeURIComponent(
                      item.title
                    )}`}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded font-semibold"
                  >
                    {t('contactBtn', 'Kontakt')}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
