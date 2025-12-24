import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { t } from '../i1n8' // koristi globalni t() koji čita lokalni lang iz localStorage

const MOCK_LISTINGS = [
  {
    id: 1,
    title: 'Luksuzan porodični stan, Telep',
    price: '145.000 €',
    location: 'Novi Sad, Telep',
    size: 115,
    rooms: 3,
    baths: 2,
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=bdc77b8b6f3b0c1b5f3e2a9a4b3f6c9a',
  },
  {
    id: 2,
    title: 'Moderan penthouse sa terasom',
    price: '299.000 €',
    location: 'Beograd, Vračar',
    size: 180,
    rooms: 4,
    baths: 3,
    image:
      'https://images.unsplash.com/photo-1572120360610-d971b9b1a6d6?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=5bf4a8b1f2f7f124e2d7b6d1f4e3a2c1',
  },
  {
    id: 3,
    title: 'Kuća sa baštom i garažom',
    price: '210.000 €',
    location: 'Novi Sad, Sremska Kamenica',
    size: 220,
    rooms: 5,
    baths: 2,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=f1a9f4e9c3a6f3c7b8d9f2a1c4e6b7d8',
  },
  {
    id: 4,
    title: 'Stan u centru - idealno za investiciju',
    price: '99.500 €',
    location: 'Novi Sad, Centar',
    size: 62,
    rooms: 2,
    baths: 1,
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b1a2a3c4d5e6f7a8b9c0d1e2f3a4b5c',
  },
  {
    id: 5,
    title: 'Porodična kuća u mirnom kraju',
    price: '175.000 €',
    location: 'Subotica, Centar',
    size: 160,
    rooms: 4,
    baths: 2,
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d',
  },
  {
    id: 6,
    title: 'Komforan stan blizu fakulteta',
    price: '79.000 €',
    location: 'Niš, Medijana',
    size: 54,
    rooms: 1,
    baths: 1,
    image:
      'https://images.unsplash.com/photo-1560448204-5a3f3d5b1b9f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=c4e5d6f7a8b9c0d1e2f3a4b5c6d7e8f9',
  },
]

export default function ProdajaPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // helper: ako t(key) vrati sam kljuc (npr. 'showCity'), vrati fallback tekst na srpskom
  const tt = (key, fallback) => {
    try {
      const val = t(key)
      return val === key ? fallback : val
    } catch {
      return fallback
    }
  }

  // Ako ima rezultata pretrage, koristi ih; inače koristi MOCK
  const initialListings = state?.properties || MOCK_LISTINGS
  const [listings, setListings] = useState(initialListings)

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [selectedCity, setSelectedCity] = useState('all')

  // visible triggers enter animation
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (err) {
      console.error('Ne mogu da sacuvam favorites', err)
    }
  }, [favorites])

  useEffect(() => {
    // delay slightly so CSS transitions run
    const tId = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(tId)
  }, [])

  // Filtriraj po gradu
  const cities = Array.from(new Set(listings.map((l) => l.location.split(',')[0].trim())))

  const filteredListings =
    selectedCity === 'all'
      ? listings
      : listings.filter((l) => l.location.toLowerCase().includes(selectedCity.toLowerCase()))

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  const toggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      setFavorites((prev) => prev.filter((f) => f.id !== item.id))
    } else {
      setFavorites((prev) => [...prev, item])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-black/60 border border-yellow-600/20 rounded-md p-3">
              <label className="text-xs text-gray-300 block mb-1 mt-5">{tt('showCity', 'Prikaži grad')}</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-black text-white p-2 rounded-md focus:outline-none"
              >
                <option value="all">{tt('allCities', 'Svi gradovi')}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl mt-2 md:mt-0 md:text-4xl font-extrabold tracking-tight text-yellow-400">
              {state?.filters ? tt('searchResults', 'Rezultati pretrage') : tt('saleTitle', 'Nekretnine na prodaju')}
            </h1>
            <p className="text-gray-300 mt-1">
              {state?.filters
                ? `${tt('searchFor', 'Pretraga za:')} ${state.filters.q || tt('allProperties', 'sve nekretnine')}`
                : tt('latestListings', 'Pregled najnovijih oglasa — crno & zlatna estetika')}
            </p>
          </div>

          <div className="text-sm text-gray-400 md:text-right">
            {tt('found', 'Pronađeno')}:&nbsp;
            <span className="text-yellow-400 font-semibold">{filteredListings.length}</span>
          </div>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((item, index) => {
              // determine initial translate direction based on index (alternate)
              const initialClass = index % 2 === 0 ? 'translate-x-8 opacity-0' : '-translate-x-8 opacity-0'
              const enterClass = 'translate-x-0 opacity-300'
              return (
                <article
                  key={item.id}
                  style={{ transitionDelay: `${index * 80}ms` }}
                  className={
                    `group bg-gradient-to-br from-gray-900 to-black border border-yellow-600/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-700 ` +
                    (visible ? enterClass : initialClass)
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
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item)
                      }}
                      className="absolute top-3 right-3 bg-black/50 hover:bg-black/30 p-2 rounded-full transition"
                      aria-label="favorite"
                    >
                      <FiHeart
                        className={`w-5 h-5 transition-colors ${
                          isFavorite(item.id) ? 'text-red-400' : 'text-yellow-400'
                        }`}
                      />
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
                        href={`mailto:serbesnekretnine@gmail.com?subject=Zainteresovan za: ${encodeURIComponent(item.title)}`}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
                      >
                        {tt('contactBtn', 'Kontakt')}
                      </a>
                    </div>
                  </div>
                </article>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">{tt('noResults', 'Nema pronađenih nekretnina sa zadatim kriterijumima.')}</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-600 transition"
              >
                {tt('backToSearch', 'Nazad na pretragu')}
              </button>
            </div>
          )}
        </div>

        {/* Pagination stub */}
        <div className="mt-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 bg-black/50 border border-yellow-600/10 rounded-md p-2 px-3 text-gray-300">
            <button className="px-3 py-1 hover:text-white">Prev</button>
            <div className="px-3 py-1 bg-black/30 rounded text-yellow-400">1</div>
            <button className="px-3 py-1 hover:text-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
