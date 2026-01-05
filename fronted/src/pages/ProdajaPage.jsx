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
    type: 'apartment',
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
    type: 'apartment',
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
    type: 'house',
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
    type: 'apartment',
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
    type: 'house',
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
    type: 'apartment',
    image:
      'https://images.unsplash.com/photo-1560448204-5a3f3d5b1b9f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=c4e5d6f7a8b9c0d1e2f3a4b5c6d7e8f9',
  },

  // dodatne nekretnine za paginaciju
  {
    id: 7,
    title: 'Vila sa pogledom na jezero',
    price: '1.200.000 €',
    location: 'Vrnjačka Banja',
    size: 420,
    rooms: 6,
    baths: 5,
    type: 'villa',
    image:
      'https://images.unsplash.com/photo-1600585154341-6a3b6e6b9f6b?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcde1234567890',
  },
  {
    id: 8,
    title: 'Plac idealan za gradnju',
    price: '45.000 €',
    location: 'Novi Sad, Petrovaradin',
    size: 800,
    rooms: 0,
    baths: 0,
    type: 'land',
    image:
      'https://images.unsplash.com/photo-1505842465776-3a6f8b6b2a5a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=plac1',
  },
  {
    id: 9,
    title: 'Poslovni prostor u poslovnoj zoni',
    price: '320.000 €',
    location: 'Beograd, Novi Beograd',
    size: 350,
    rooms: 0,
    baths: 2,
    type: 'office',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=office1',
  },
  {
    id: 10,
    title: 'Manji lokal za izdavanje',
    price: '42.000 €',
    location: 'Novi Sad, Detelinara',
    size: 45,
    rooms: 0,
    baths: 1,
    type: 'office',
    image:
      'https://images.unsplash.com/photo-1542318424-380f9a1f9b1a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=local1',
  },
  {
    id: 11,
    title: 'Vikendica pored reke',
    price: '68.000 €',
    location: 'Sremska Mitrovica',
    size: 85,
    rooms: 2,
    baths: 1,
    type: 'house',
    image:
      'https://images.unsplash.com/photo-1505691723518-36a7be3e4a07?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=vikendica1',
  },
  {
    id: 12,
    title: 'Plac - poljoprivredno zemljište',
    price: '12.500 €',
    location: 'Niš, okolna mesta',
    size: 1500,
    rooms: 0,
    baths: 0,
    type: 'land',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=place2',
  },
]

export default function ProdajaPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location // state iz navigate/link

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

  // visible za animacije ulaska
  const [visible, setVisible] = useState(false)

  // PAGINACIJA
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 6

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (err) {
      console.error('Ne mogu da sacuvam favorites', err)
    }
  }, [favorites])

  useEffect(() => {
    // mala delay pre prikaza za animacije
    const tId = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(tId)
  }, [])

  // --- čitanje filtera tipa iz state ili query param ---
  const typeFromState = state?.filters?.type
  const queryParams = new URLSearchParams(location.search)
  const typeFromQuery = queryParams.get('type')
  const typeFilter = typeFromState || typeFromQuery || null

  // filtriranje po tipu ako je filter prosleđen
  const filteredListings = typeFilter
    ? listings.filter((l) => String(l.type).toLowerCase() === String(typeFilter).toLowerCase())
    : listings

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE))

  // Ensure currentPage in range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
    if (currentPage < 1) setCurrentPage(1)
  }, [currentPage, totalPages])

  const paginatedListings = filteredListings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  const toggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      setFavorites((prev) => prev.filter((f) => f.id !== item.id))
    } else {
      setFavorites((prev) => [...prev, item])
    }
  }

  const goToPage = (n) => {
    const page = Math.min(Math.max(1, n), totalPages)
    setCurrentPage(page)
    window.scrollTo({ top: 150, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-white text-white py-12 px-6">
      <div className="max-w-7xl mx-auto lg:mt-5">
        {/* Top row (bez filtera grada) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl mt-6 font-extrabold text-yellow-400">
              {typeFilter ? `${tt(typeFilter, typeFilter)} — ${tt('saleTitle', 'Prodaja')}` : tt('saleTitle', 'Nekretnine na')}
            </h1>
            <p className="text-gray-300 mt-1">
              {typeFilter
                ? `${tt('searchFor', 'Pretraga za:')} ${typeFilter}`
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
          {paginatedListings.length > 0 ? (
            paginatedListings.map((item, index) => {
              // determine initial translate direction based on index (alternate)
              const initialClass = index % 2 === 0 ? 'translate-x-8 opacity-0' : '-translate-x-8 opacity-0'
              const enterClass = 'translate-x-0 opacity-100'
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

                    <div className="absolute top-12 left-3 bg-black/60 text-yellow-300 px-2 py-1 rounded-md text-xs font-medium border border-yellow-600/10">
                      {tt(item.type, item.type)} {/* koristi t(key) gde je moguće */}
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

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-800 text-gray-500' : 'bg-black/50 text-white hover:bg-black'}`}
          >
            {tt('prev', 'Prethodna')}
          </button>

          {/* page numbers */}
          <div className="inline-flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 rounded-md ${currentPage === page ? 'bg-yellow-400 text-black font-semibold' : 'bg-black/30 text-gray-300 hover:bg-black/60'}`}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-800 text-gray-500' : 'bg-black/50 text-white hover:bg-black'}`}
          >
            {tt('next', 'Sledeća')}
          </button>
        </div>
      </div>
    </div>
  )
}
