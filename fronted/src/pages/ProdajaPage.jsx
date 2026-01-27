import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { t } from '../i1n8'
import { API_BASE } from '../config'

export default function ProdajaPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const topRef = useRef(null) // 1. DODATO: Ref za skrolovanje

  const typeFilter = location.state?.type || ""

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('') // 2. DODATO: State za greške
  const [currentPage, setCurrentPage] = useState(1)

  // 3. POPRAVLJENO: Zaštita od pucanja ako je localStorage pokvaren
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      console.error('Failed parsing favorites from localStorage', e)
      return []
    }
  })

  const itemsPerPage = 9;

  // Stabilan ID generator
  const makeStableId = (item) => {
    if (!item) return ''
    if (item.id) return String(item.id)
    if (item.code) return String(item.code)
    const base = `${item.naslov ?? ''}|${item.mesto ?? ''}|${item.kvadratura_int ?? ''}`
    return base.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '') || ''
  }

  // 4. DODATO: Helper za čišćenje broja telefona
  const formatTel = (raw) => {
    if (!raw) return ''
    return String(raw).replace(/[^\d+]/g, '')
  }

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (e) {
      console.error('Neuspešno čuvanje favorites u localStorage', e)
    }
  }, [favorites])

  useEffect(() => {
    const ac = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('') // Resetuj grešku pre novog poziva

        const res = await fetch(`${API_BASE}/oglasi/prodaja`, { signal: ac.signal })
        
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`)
        }

        const data = await res.json()
        const arr = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : [])
        const normalized = arr.map(d => ({ ...d, id: makeStableId(d) }))

        if (import.meta.env?.DEV) {
          console.log('Učitani oglasi (Prodaja):', normalized.length)
        }

        setListings(normalized)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Fetch error:', err)
        // 5. DODATO: Prikaz greške korisniku umesto samo konzole
        setError('Došlo je do problema sa učitavanjem oglasa. Pokušajte ponovo.')
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => ac.abort()
  }, [API_BASE])


  // 6. POPRAVLJENO: Bolje skrolovanje na promenu filtera
  useEffect(() => {
    setCurrentPage(1)
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [typeFilter])

  // Skrol na promenu stranice (paginacija)
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [currentPage])


  const normalizeText = (text) => {
    if (!text) return "";
    return text.toString().toLowerCase()
      .trim() // Dodato trim
      .replace(/ć|č/g, 'c')
      .replace(/š/g, 's')
      .replace(/đ/g, 'dj')
      .replace(/ž/g, 'z')
      .replace(/[^a-z0-9]/g, '');
  }

  // 7. POPRAVLJENO: Robusnija logika filtriranja (ista kao Izdavanje)
  const filteredListings = typeFilter
    ? listings.filter(l => {
        const dbType = normalizeText(l.vrstanekretnine || '');
        const dbTitle = normalizeText(l.naslov || '');
        const filterType = normalizeText(typeFilter);

        // Osnovna provera
        if (dbType.includes(filterType)) return true;

        // Proširena provera sinonima
        if (filterType.includes('poslovni')) {
           const sinonimi = ['lokal', 'magacin', 'hala', 'kancelarija', 'radionica', 'poslovni']
           return sinonimi.some(s => dbType.includes(s) || dbTitle.includes(s))
        }
        
        if (filterType.includes('kuca')) {
            const sinonimi = ['kuca', 'vikendica', 'vila', 'objekat']
            return sinonimi.some(s => dbType.includes(s) || dbTitle.includes(s))
        }

        if (filterType.includes('stan')) {
            const sinonimi = ['stan', 'garsonjera', 'apartman', 'penthouse']
            return sinonimi.some(s => dbType.includes(s) || dbTitle.includes(s))
        }

        return false;
      })
    : listings

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const currentItems = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const tt = (key, fallback) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  function formatPrice(price) {
    if (price === null || price === undefined || price === '') return '';
    const num = Number(String(price).replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(num)) return String(price);
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Math.round(num)) + ' €';
  }

  const makeFavObject = (item) => {
    const id = String(item.id ?? makeStableId(item))
    return {
      id,
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
      return updated // useEffect ce ovo sacuvati u localStorage
    })
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 font-bold text-2xl animate-pulse">Učitavanje...</div>

  return (
    <div className="min-h-screen bg-white text-white py-24 px-6">
      <div className="max-w-7xl mx-auto" ref={topRef}> {/* DODAT REF OVDE */}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-yellow-400 uppercase tracking-tighter">
              {typeFilter ? `${typeFilter} - Prodaja` : tt('saleTitle', 'Prodaja')}
            </h1>
            <p className="text-gray-400 mt-2">{t('pronadjeno')} {filteredListings.length}  {t('nekretnina')}</p>
            {/* 8. DODATO: Prikaz greške */}
            {error && <div className="mt-2 text-sm text-red-500 font-bold bg-red-100 p-2 rounded">{error}</div>}
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl border border-dashed border-gray-300 rounded-3xl">
            {t('nemaRezultata')} <span className="text-yellow-400">{typeFilter}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(item => {
              const stableId = String(item.id ?? item.code ?? Date.now())
              return (
                <article key={stableId} className="bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-4 hover:border-yellow-500 transition-all group">
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
                      <button onClick={() => navigate(`/single/${encodeURIComponent(item.id ?? item.code ?? '')}`, { state: { item } })} className="col-span-4 bg-transparent border border-yellow-600/30 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition">Detalji</button>
                      
                      {/* 9. DODATO: Siguran link za telefon */}
                      <a href={`tel:${formatTel(item.contactphone)}`} className="col-span-1 bg-yellow-500 flex items-center justify-center rounded-xl text-black font-bold">
                         {t('contactTitle')}
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => prev - 1)} // Uklonjen manualni scrollTo, resava useEffect
                className="p-4 bg-black rounded-xl disabled:opacity-30 text-white"
            >
                <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-12 h-12 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
                {i + 1}
              </button>
            ))}
            <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                className="p-4 bg-black rounded-xl disabled:opacity-30 text-white"
            >
                <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}