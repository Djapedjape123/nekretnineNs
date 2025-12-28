import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { t } from '../i1n8'

const FIRST_PAGE_COUNT = 6
const NEXT_PAGE_COUNT = 4

const MOCK_RENTALS = [
  {
    id: 1,
    title: 'Moderan stan u centru, Beograd',
    price: '450 €/mesec',
    location: 'Beograd, Vračar',
    size: 75,
    rooms: 2,
    baths: 1,
    type: 'stan',
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
    type: 'stan',
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
    type: 'kuca',
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
    type: 'stan',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 5,
    title: 'Vikendica pored reke - kratkoročno/dugoročno',
    price: '420 €/mesec',
    location: 'Sremska Mitrovica',
    size: 90,
    rooms: 2,
    baths: 1,
    type: 'vila',
    image: 'https://images.unsplash.com/photo-1505691723518-36a7be3e4a07?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 6,
    title: 'Poslovni prostor - prizemlje, prometna lokacija',
    price: '1.200 €/mesec',
    location: 'Novi Sad, Bulevar',
    size: 140,
    rooms: 0,
    baths: 2,
    type: 'poslovni',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 7,
    title: 'Plac na prodaju/izdavanje (poljoprivreda)',
    price: '200 €/mesec (po dogovoru)',
    location: 'Niš, okolna mesta',
    size: 2000,
    rooms: 0,
    baths: 0,
    type: 'zemljiste',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 8,
    title: 'Studio apartman, novogradnja',
    price: '380 €/mesec',
    location: 'Beograd, Zvezdara',
    size: 40,
    rooms: 1,
    baths: 1,
    type: 'stan',
    image: 'https://images.unsplash.com/photo-1542318424-380f9a1f9b1a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 9,
    title: 'Mala vikend-kuća / odmor',
    price: '300 €/mesec',
    location: 'Fruška Gora',
    size: 65,
    rooms: 2,
    baths: 1,
    type: 'kuca',
    image: 'https://images.unsplash.com/photo-1505842465776-3a6f8b6b2a5a?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    id: 10,
    title: 'Luksuzna vila sa bazenom - kratkoročno izdavanje',
    price: '2.500 €/mesec',
    location: 'Dedinje',
    size: 450,
    rooms: 7,
    baths: 6,
    type: 'vila',
    image: 'https://images.unsplash.com/photo-1600585154341-6a3b6e6b9f6b?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
]

export default function IzdavanjePage() {
  const navigate = useNavigate()
  const location = useLocation()

  // helper koji koristi t() ali vraća fallback ako t vrati ključ
  const tt = (key, fallback) => {
    try {
      const val = t(key)
      return val === key ? fallback : val
    } catch {
      return fallback
    }
  }

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // pročitamo filter iz router state-a (navBar šalje: state={{ filters: { type: 'stan' } }})
  const typeFilter = location?.state?.filters?.type || null

  // koristimo filtrirane nekretnine (ako je prosleđen typeFilter)
  const rentals = typeFilter ? MOCK_RENTALS.filter((r) => r.type === typeFilter) : MOCK_RENTALS

  const isFavorite = (id) => favorites.some((f) => f.id === id)

  const toggleFavorite = (item) => {
    if (isFavorite(item.id)) {
      setFavorites((prev) => prev.filter((f) => f.id !== item.id))
    } else {
      setFavorites((prev) => [...prev, item])
      navigate('/favorite')
    }
  }

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1)

  // kad se promeni filter, vrati na prvu stranicu
  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter])

  const getStartIndex = () => {
    if (currentPage === 1) return 0
    return FIRST_PAGE_COUNT + (currentPage - 2) * NEXT_PAGE_COUNT
  }

  const getItemsPerPage = () => (currentPage === 1 ? FIRST_PAGE_COUNT : NEXT_PAGE_COUNT)

  const startIndex = getStartIndex()
  const itemsPerPage = getItemsPerPage()
  const endIndex = startIndex + itemsPerPage

  const visibleRentals = rentals.slice(startIndex, endIndex)

  const totalPages =
    rentals.length <= FIRST_PAGE_COUNT
      ? 1
      : 1 + Math.ceil((rentals.length - FIRST_PAGE_COUNT) / NEXT_PAGE_COUNT)

  const goToPage = (n) => {
    const page = Math.min(Math.max(1, n), totalPages)
    setCurrentPage(page)
    window.scrollTo({ top: 150, behavior: 'smooth' })
  }

  /* ================= ANIMATION ================= */
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(false)
    const id = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(id)
  }, [currentPage, typeFilter])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl mt-6 font-extrabold text-yellow-400">
              {typeFilter ? `${tt(typeFilter, typeFilter)} — ${tt('rentTitle', 'Izdavanje')}` : tt('rentTitle', 'Nekretnine za izdavanje')}
            </h1>
            <p className="text-gray-400 mt-1">
              {t('latestListings', 'Pregled najnovijih oglasa')}
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {tt('page', 'Strana')} {currentPage} / {totalPages}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRentals.map((item, index) => (
            <article
              key={item.id}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={`group bg-gradient-to-br from-gray-900 to-black border border-yellow-600/10 rounded-xl overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-700 transform ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
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

                <div className="absolute top-12 left-3 bg-black/60 text-yellow-300 px-2 py-1 rounded text-xs font-medium border border-yellow-600/10">
                  {t(item.type, item.type)}
                </div>

                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
                >
                  <FiHeart
                    className={`w-5 h-5 ${isFavorite(item.id) ? 'text-red-400' : 'text-yellow-400'}`}
                  />
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg">{item.title}</h3>

                <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                  <MdLocationOn className="text-yellow-400" />
                  {item.location}
                </div>

                <div className="flex gap-4 text-sm text-gray-400 mt-4">
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
                    onClick={() => navigate(`/single/${item.id}`)}
                    className="flex-1 border border-yellow-600/30 text-yellow-400 py-2 rounded hover:bg-yellow-600/10"
                  >
                    {t('details', 'Detalji')}
                  </button>

                  <a
                    href={`mailto:serbesnekretnine@gmail.com?subject=Zainteresovan za: ${encodeURIComponent(item.title)}`}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded font-semibold"
                  >
                    {t('contactBtn', 'Kontakt')}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-800 text-gray-500' : 'bg-black/50 text-white hover:bg-black'}`}
          >
            {tt('prev', 'Prethodna')}
          </button>

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
