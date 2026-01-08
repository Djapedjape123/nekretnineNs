import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { t } from '../i1n8'
import { API_BASE } from '../config'

export default function IzdavanjePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const topRef = useRef(null)

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
        const response = await fetch(`${API_BASE}/oglasi/izdavanje`)
        const data = await response.json()
        setListings(data)
      } catch (err) { 
        console.error("Greška pri učitavanju:", err) 
      } finally { 
        setLoading(false) 
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [typeFilter])

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key])

  const tt = (key, fallback) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  // --- NAJJAČA FUNKCIJA ZA NORMALIZACIJU ---
  const normalizeText = (text) => {
    if (!text) return "";
    return text.toString()
      .toLowerCase()
      .trim()
      .replace(/ć|č/g, 'c')
      .replace(/š/g, 's')
      .replace(/đ/g, 'dj')
      .replace(/ž/g, 'z')
      .replace(/[^a-z0-9]/g, ''); // Briše razmake, crtice, zareze, tačke...
  }

  // --- ULTRA FILTRIRANJE ---
  const filteredListings = typeFilter
    ? listings.filter(l => {
        // Šta piše u bazi (npr. "Kuća") -> postaje "kuca"
        const dbValue = normalizeText(l.vrstanekretnine);
        // Šta piše u naslovu (ako u vrstanekretnine fali podatak)
        const dbTitle = normalizeText(l.naslov);
        // Šta smo kliknuli u meniju (npr. "Kuca") -> postaje "kuca"
        const filterTarget = normalizeText(typeFilter);

        // 1. Direktna provera (ako se poklapaju očišćeni tekstovi)
        if (dbValue.includes(filterTarget)) return true;

        // 2. SPECIJALNA LOGIKA ZA KUĆE
        if (filterTarget.includes('kuca')) {
          const kucaSinonimi = ['kuca', 'vikendica', 'objekat', 'vila', 'spratkuce'];
          const isKuca = kucaSinonimi.some(s => dbValue.includes(s) || dbTitle.includes(s));
          if (isKuca) return true;
        }

        // 3. SPECIJALNA LOGIKA ZA POSLOVNE PROSTORE
        if (filterTarget.includes('poslovni')) {
          const poslovniSinonimi = ['poslovni', 'lokal', 'magacin', 'hala', 'kancelarija', 'radionica', 'stovariste'];
          const isPoslovni = poslovniSinonimi.some(s => dbValue.includes(s) || dbTitle.includes(s));
          if (isPoslovni) return true;
        }

        // 4. SPECIJALNA LOGIKA ZA STANOVE
        if (filterTarget.includes('stan')) {
          const stanSinonimi = ['stan', 'garsonjera', 'apartman'];
          const isStan = stanSinonimi.some(s => dbValue.includes(s) || dbTitle.includes(s));
          if (isStan) return true;
        }

        return false;
      })
    : listings

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const currentItems = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  function formatPrice(price) {
    if (price === null || price === undefined || price === '') return '';
    const num = Number(String(price).replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(num)) return String(price);
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Math.round(num)) + ' €';
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 font-bold text-2xl animate-pulse">Učitavanje...</div>

  return (
    <div className="min-h-screen bg-white text-white py-24 px-6">
      <div className="max-w-7xl mx-auto" ref={topRef}>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-yellow-400 uppercase tracking-tighter">
              {typeFilter ? `${typeFilter} - Izdavanje` : tt('rentTitle', 'Izdavanje Nekretnina')}
            </h1>
            <p className="text-gray-400 mt-2">Pronađeno {filteredListings.length} oglasa</p>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl border border-dashed border-white/10 rounded-3xl">
            Nema rezultata za kategoriju: <span className="text-yellow-400">{typeFilter}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(item => (
              <article key={item.id} className="bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-4 hover:border-yellow-500 transition-all group">
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
                    {formatPrice(item.cena)}
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
                    <button onClick={() => navigate(`/single/${encodeURIComponent(item.id ?? item.code ?? '')}`, { state: { item } })} className="col-span-4 bg-transparent border border-yellow-600/30 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition">{t('details')}</button>
                    <a href={`tel:${item.contactphone}`} className="col-span-1 bg-yellow-500 flex items-center justify-center rounded-xl text-black font-bold">{t('contactTitle')}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => prev - 1)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="p-4 bg-gray-900 rounded-xl disabled:opacity-30 text-white"
            ><FaChevronLeft/></button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`w-12 h-12 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => prev + 1)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="p-4 bg-black rounded-xl disabled:opacity-30 text-white"
            ><FaChevronRight/></button>
          </div>
        )}
      </div>
    </div>
  )
}