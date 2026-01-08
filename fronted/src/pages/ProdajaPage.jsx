import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { t } from '../i1n8'

export default function ProdajaPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const typeFilter = location.state?.type || ""

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState(() => {
    const raw = localStorage.getItem('favorites')
    return raw ? JSON.parse(raw) : []
  })

  const itemsPerPage = 9

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3001/oglasi/prodaja')
        const data = await response.json()
        setListings(data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter])

  const tt = (key, fallback) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  const filteredListings = typeFilter
    ? listings.filter(l => (l.naslov || '').toLowerCase().includes(typeFilter.toLowerCase()))
    : listings

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const currentItems = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Helper: normalizacija objekta koji cuvamo kao favorite
  const makeFavObject = (item) => {
    return {
      id: String(item.id ?? item.code ?? Date.now()),
      title: item.naslov || item.title || '',
      price: item.cena ? `${item.cena} €` : (item.price || ''),
      location: [item.mesto, item.naselje].filter(Boolean).join(', ') || (item.location || ''),
      size: item.kvadratura_int || item.size || 0,
      rooms: item.brojsoba || item.rooms || 0,
      baths: item.brojkupatila || item.baths || 0,
      image: item.slike?.slika?.[0]?.url || item.image || '/placeholder.jpg',
      contactphone: item.contactphone || ''
    }
  }

  const isFavorite = (id) => {
    if (id === undefined || id === null) return false
    const sid = String(id)
    return favorites.some(f => String(f.id) === sid)
  }

  const toggleFavorite = (item) => {
    const favObj = makeFavObject(item)
    setFavorites(prev => {
      const exists = prev.some(p => p.id === favObj.id)
      const updated = exists ? prev.filter(p => p.id !== favObj.id) : [...prev, favObj]
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }
 
  function formatPrice(price) {
    if (price === null || price === undefined || price === '') return '';
    // pokušaj parsiranja (podržava stringove i brojeve)
    const num = Number(String(price).replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(num)) return String(price);
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Math.round(num)) + ' €';
  }

  //bg-gradient-to-b from-black via-gray-900
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 font-bold text-2xl animate-pulse">Učitavanje...</div>

  return (
    <div className="min-h-screen bg-white text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-yellow-400 uppercase tracking-tighter">
              {typeFilter ? `${typeFilter} - Prodaja` : tt('saleTitle', 'Prodaja')}
            </h1>
            <p className="text-gray-400 mt-2">Pronađeno {filteredListings.length} nekretnina</p>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl">Nema rezultata za traženi filter.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(item => {
              const stableId = String(item.id ?? item.code ?? Date.now())
              return (
                <article key={stableId} className="bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-400/50 transition-all group">
                  <div className="relative h-64">
                    <img src={item.slike?.slika?.[0]?.url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button onClick={() => toggleFavorite(item)} className="p-3 bg-black/50 backdrop-blur-md rounded-full">
                        <FiHeart className={isFavorite(item.id ?? item.code) ? "text-red-500 fill-red-500" : "text-white"} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-yellow-400 text-black px-4 py-1 rounded-lg font-black text-xl">
                      {formatPrice(item.cena)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold line-clamp-1">{item.naslov}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mt-2 text-sm">
                      <MdLocationOn className="text-yellow-400" /> {item.mesto}, {item.naselje}
                    </div>
                    <div className="flex gap-4 mt-4 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-1"><FaBed className="text-yellow-400" /> {item.brojsoba}</div>
                      <div className="flex items-center gap-1"><FaBath className="text-yellow-400" /> {item.brojkupatila}</div>
                      <div className="ml-auto font-bold text-yellow-400">{item.kvadratura_int} m²</div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mt-6">
                      <button onClick={() => navigate(`/single/${encodeURIComponent(item.id ?? item.code ?? '')}`, { state: { item } })} className="col-span-4  bg-transparent border border-yellow-600/30 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition">Detalji</button>
                      <a href={`tel:${item.contactphone}`} className="col-span-1 bg-yellow-500 flex items-center justify-center rounded-xl text-black font-bold">{t('contactTitle')}</a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0, 0) }} className="p-4 bg-gray-900 rounded-xl disabled:opacity-30"><FaChevronLeft /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 0) }} className={`w-12 h-12 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-white'}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0, 0) }} className="p-4 bg-gray-900 rounded-xl disabled:opacity-30"><FaChevronRight /></button>
          </div>
        )}
      </div>
    </div>
  )
}
