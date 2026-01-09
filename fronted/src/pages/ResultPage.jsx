import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { t } from '../i1n8'
import { API_BASE } from '../config'

export default function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  // ----- podrška za HomePage + SearchMore -----
  const transaction = query.get('transaction') || ''
  const type = query.get('type') || ''

  // grad / kvart / district
  const city = query.get('city') || ''
  const district = query.get('district') || query.get('kvart') || ''

  // cena
  const price_min = query.get('price_min') || query.get('priceFrom') || ''
  const price_max = query.get('price_max') || query.get('priceTo') || ''

  // kvadratura
  const area_min = query.get('area_min') || ''
  const area_max = query.get('area_max') || ''

  // broj soba (HomePage šalje samo jedan parametar)
  const brojsoba = query.get('brojsoba') || ''
  const brojsoba_od = query.get('brojsoba_od') || brojsoba || ''
  const brojsoba_do = query.get('brojsoba_do') || brojsoba || ''

  // dodatni filteri
  const lift = query.get('lift') || ''
  const terasa = query.get('terasa') || ''
  const namesten = query.get('namesten') || ''
  const parking = query.get('parking') || ''

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState(() => {
    const raw = localStorage.getItem('favorites')
    return raw ? JSON.parse(raw) : []
  })

  const itemsPerPage = 9

  // Ensure page scrolls to top when component mounts or when route/search changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  // Fetch filtered oglasi sa servera
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          transaction,
          type,
          city,
          district,
          price_min,
          price_max,
          area_min,
          area_max,
          brojsoba_od,
          brojsoba_do,
          lift,
          terasa,
          namesten,
          parking
        })
        const res = await fetch(`${API_BASE}/oglasi/search?${params.toString()}`)
        const data = await res.json()
        setListings(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [
    transaction,
    type,
    city,
    district,
    price_min,
    price_max,
    area_min,
    area_max,
    brojsoba_od,
    brojsoba_do,
    lift,
    terasa,
    namesten,
    parking
  ])

  // Reset paginacije na novu pretragu
  useEffect(() => {
    setCurrentPage(1)
  }, [
    transaction,
    type,
    city,
    district,
    price_min,
    price_max,
    area_min,
    area_max,
    brojsoba_od,
    brojsoba_do,
    lift,
    terasa,
    namesten,
    parking
  ])

  const tt = (key, fallback) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  // --- funkcija koja pravi čitljiv rezime filtera ---
  const buildSearchSummary = () => {
    const parts = []

    if (transaction) parts.push(`${tt('transaction', 'Transakcija')}: ${transaction}`)
    if (type) parts.push(`${tt('type', 'Tip')}: ${type}`)
    if (city) parts.push(`${tt('city', 'Grad')}: ${city}`)
    if (district) parts.push(`${tt('district', 'Kvart')}: ${district}`)

    if (price_min || price_max) {
      if (price_min && price_max) parts.push(`Cena: ${price_min} - ${price_max} €`)
      else if (price_min) parts.push(`Cena ≥ ${price_min} €`)
      else parts.push(`Cena ≤ ${price_max} €`)
    }

    if (area_min || area_max) {
      if (area_min && area_max) parts.push(`Kvadratura: ${area_min} - ${area_max} m²`)
      else if (area_min) parts.push(`Kvadratura ≥ ${area_min} m²`)
      else parts.push(`Kvadratura ≤ ${area_max} m²`)
    }

    if (brojsoba_od || brojsoba_do) {
      if (brojsoba_od && brojsoba_do) parts.push(`Broj soba: ${brojsoba_od} - ${brojsoba_do}`)
      else if (brojsoba_od) parts.push(`Broj soba ≥ ${brojsoba_od}`)
      else parts.push(`Broj soba ≤ ${brojsoba_do}`)
    }

    const extras = []
    if (lift && lift !== 'false') extras.push('Lift')
    if (terasa && terasa !== 'false') extras.push('Terasa')
    if (namesten && namesten !== 'false') extras.push('Namešten')
    if (parking && parking !== 'false') extras.push('Parking')
    if (extras.length) parts.push(`Dodatno: ${extras.join(', ')}`)

    return parts
  }

  const summary = buildSearchSummary()

  // Paginacija
  const totalPages = Math.ceil(listings.length / itemsPerPage)
  const currentItems = listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Favorite sistem
  const makeFavObject = (item) => ({
    id: item.id?.toString() || String(item.code || Date.now()),
    title: item.naslov || item.title || '',
    price: item.cena ? `${item.cena} €` : (item.price || ''),
    location: [item.mesto, item.naselje].filter(Boolean).join(', ') || (item.location || ''),
    size: item.kvadratura_int || item.size || 0,
    rooms: item.brojsoba || item.rooms || 0,
    baths: item.brojkupatila || item.baths || 0,
    image: item.slike?.slika?.[0]?.url || item.image || '/placeholder.jpg',
    contactphone: item.contactphone || ''
  })

  const isFavorite = (id) => {
    if (id === undefined || id === null) return false
    const sid = id.toString()
    return favorites.some(f => f.id === sid)
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

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 font-bold text-2xl animate-pulse">
      Učitavanje...
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-yellow-400 uppercase tracking-tighter">
              {tt('searchResults', 'Rezultati pretrage')}
            </h1>
            <p className="text-gray-400 mt-2">Pronađeno {listings.length} oglasa</p>
          </div>

          {/* Ovde prikazujemo rezime pretrage */}
          <div className="min-w-[220px]">
            {summary.length === 0 ? (
              <div className="text-sm text-gray-400">{t('nemaFiltera')}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {summary.map((s, i) => (
                  <span key={i} className="text-sm bg-black border border-yellow-300 px-3 py-1 rounded-full text-white">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl border border-dashed border-white/10 rounded-3xl">
            {t('nemaRezultata')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(item => (
              <article key={item.id} className="bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-400/50 transition-all group">
                <div className="relative h-64">
                  <img 
                    src={item.slike?.slika?.[0]?.url || item.image || '/placeholder.jpg'} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute top-4 right-4">
                    <button onClick={() => toggleFavorite(item)} className="p-3 bg-black/50 backdrop-blur-md rounded-full">
                      <FiHeart className={isFavorite(item.id) ? "text-red-500 fill-red-500" : "text-white"} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-yellow-400 text-black px-4 py-1 rounded-lg font-black text-xl">
                    {item.cena || item.price} €
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold line-clamp-1">{item.naslov || item.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 mt-2 text-sm">
                    <MdLocationOn className="text-yellow-400" /> {item.mesto || item.location}
                  </div>
                  <div className="flex gap-4 mt-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1"><FaBed className="text-yellow-400"/> {item.brojsoba || 0}</div>
                    <div className="flex items-center gap-1"><FaBath className="text-yellow-400"/> {item.brojkupatila || 0}</div>
                    <div className="ml-auto font-bold text-yellow-400">{item.kvadratura_int || item.size} m²</div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-6">
                    <button onClick={() => navigate(`/single/${encodeURIComponent(item.id ?? item.code ?? '')}`, { state: { item } })} className="col-span-4 bg-transparent border-2 border-yellow-600/30 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition">Detalji</button>
                    <a href={`tel:${item.contactphone}`} className="col-span-1 bg-yellow-500 flex items-center justify-center rounded-xl text-black font-bold">{t('contactTitle')}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0,0) }} className="p-4 bg-black rounded-xl disabled:opacity-30"><FaChevronLeft/></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo(0,0) }} className={`w-12 h-12 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0,0) }} className="p-4 bg-black rounded-xl disabled:opacity-30"><FaChevronRight/></button>
          </div>
        )}
      </div>
    </div>
  )
}
